import "dotenv/config";

import mongoose, { Types } from "mongoose";

import Customer from "../models/customer.model";
import Product from "../models/product.model";
import Order from "../models/order.model";
import Payment from "../models/payment.model";

import { generateAndProcessBatches } from "../utils/bulkProcessor";
import { connectDatabase } from "../config/database";

const CUSTOMER_COUNT = Number(process.env.CUSTOMER_COUNT) || 10000;
const PRODUCT_COUNT = Number(process.env.PRODUCT_COUNT) || 1000;
const ORDER_COUNT = Number(process.env.ORDER_COUNT) || 50000;
const BATCH_SIZE = Number(process.env.BATCH_SIZE) || 1000;


// GENERATE RANDOM DATE

const generateRandomDate = (): Date => {
    const startDate = new Date("2020-01-01T00:00:00.000Z").getTime();
    const endDate = new Date("2026-12-31T23:59:59.999Z").getTime();

    const randomTimestamp =
        startDate + Math.random() * (endDate - startDate);

    return new Date(randomTimestamp);
};


// GENERATE CUSTOMERS

const generateCustomers = (startIndex: number, count: number) => {
    return Array.from({ length: count }, (_, index) => {
        const actualIndex = startIndex + index;

        return {
            name: `Customer ${actualIndex + 1}`,
            email: `customer${actualIndex + 1}@example.com`,
            phone: `98765${String(actualIndex).padStart(5, "0")}`,
            city: ["Surat", "Mumbai", "Delhi", "Pune", "Bangalore"][actualIndex % 5],
            isActive: actualIndex % 2 === 0,
        };
    });
};


// GENERATE PRODUCTS

const generateProducts = (startIndex: number, count: number) => {
    const categories = [
        "Electronics",
        "Clothing",
        "Footwear",
        "Accessories",
        "Home"
    ];

    const tags = [
        "new",
        "popular",
        "discount",
        "trending",
        "premium"
    ];

    return Array.from({ length: count }, (_, index) => {
        const actualIndex = startIndex + index;

        return {
            name: `Product ${actualIndex + 1}`,
            sku: `SKU-${String(actualIndex + 1).padStart(6, "0")}`,
            description: `Description for product ${actualIndex + 1}`,
            price: 100 + (actualIndex % 1000),
            category: categories[actualIndex % categories.length],
            tags: [
                tags[actualIndex % tags.length],
                tags[(actualIndex + 1) % tags.length]
            ],
            stock: 10 + (actualIndex % 500),
            isActive: actualIndex % 2 === 0,
        };
    });
};


// GENERATE ORDERS

const generateOrders = (
    startIndex: number,
    count: number,
    customers: Array<{ _id: Types.ObjectId }>,
    products: Array<{
        _id: Types.ObjectId;
        name: string;
        price: number;
    }>
) => {
    const orderStatuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
    ] as const;

    const paymentStatuses = [
        "pending",
        "paid",
        "failed",
        "refunded"
    ] as const;

    return Array.from({ length: count }, (_, index) => {
        const actualIndex = startIndex + index;

        const customer = customers[actualIndex % customers.length];

        const itemCount = (actualIndex % 3) + 1;

        const items = Array.from({ length: itemCount }, (_, itemIndex) => {
            const product = products[
                (actualIndex + itemIndex) % products.length
            ];

            const quantity = ((actualIndex + itemIndex) % 4) + 1;

            return {
                product: product._id,
                productName: product.name,
                quantity,
                unitPrice: product.price
            };
        });

        const totalAmount = items.reduce(
            (total, item) => total + item.quantity * item.unitPrice,
            0
        );

        return {
            orderNumber: `ORD-${String(actualIndex + 1).padStart(8, "0")}`,
            customer: customer._id,
            items,
            totalAmount,
            orderStatus: orderStatuses[actualIndex % orderStatuses.length],
            paymentStatus: paymentStatuses[actualIndex % paymentStatuses.length],
            orderDate: generateRandomDate()
        };
    });
};


// GENERATE PAYMENTS

const generatePayments = (
    orders: Array<{
        _id: Types.ObjectId;
        totalAmount: number;
    }>,
    startIndex: number
) => {
    const paymentMethods = [
        "card",
        "upi",
        "netbanking",
        "cod"
    ] as const;

    const paymentStatuses = [
        "pending",
        "success",
        "failed",
        "refunded"
    ] as const;

    return orders.map((order, index) => {
        const actualIndex = startIndex + index;

        return {
            order: order._id,
            transactionId: `TXN-${String(actualIndex + 1).padStart(8, "0")}`,
            amount: order.totalAmount,
            currency: "INR",
            paymentMethod: paymentMethods[actualIndex % paymentMethods.length],
            status: paymentStatuses[actualIndex % paymentStatuses.length],
            paymentDate: generateRandomDate()
        };
    });
};


// MAIN SEEDING FUNCTION

const seedDatabase = async (): Promise<void> => {
    try {
        const startTime = performance.now();

        // 1. Connect to MongoDB
        await connectDatabase();

        // 2. Generate and insert customers
        console.log("Generating customers...");

        const savedCustomers: { _id: Types.ObjectId }[] = [];

        await generateAndProcessBatches(
            CUSTOMER_COUNT,
            BATCH_SIZE,
            (startIndex, batchSize) =>
                generateCustomers(startIndex, batchSize),
            async (batch) => {
                const inserted = await Customer.insertMany(batch);
                savedCustomers.push(...inserted);
            }
        );

        // 3. Generate and insert products
        console.log("Generating products...");

        const savedProducts: {
            _id: Types.ObjectId;
            name: string;
            price: number;
        }[] = [];

        await generateAndProcessBatches(
            PRODUCT_COUNT,
            BATCH_SIZE,
            (startIndex, batchSize) =>
                generateProducts(startIndex, batchSize),
            async (batch) => {
                const inserted = await Product.insertMany(batch);
                savedProducts.push(...inserted);
            }
        );

        // 4. Generate and insert orders
        console.log("Generating orders...");

        const savedOrders: {
            _id: Types.ObjectId;
            totalAmount: number;
        }[] = [];

        await generateAndProcessBatches(
            ORDER_COUNT,
            BATCH_SIZE,
            (startIndex, batchSize) =>
                generateOrders(
                    startIndex,
                    batchSize,
                    savedCustomers,
                    savedProducts
                ),
            async (batch) => {
                const inserted = await Order.insertMany(batch);
                savedOrders.push(...inserted);
            }
        );

        // 5. Generate and insert payments
        console.log("Generating payments...");

        await generateAndProcessBatches(
            savedOrders.length,
            BATCH_SIZE,
            (startIndex, batchSize) => {
                const orderBatch = savedOrders.slice(
                    startIndex,
                    startIndex + batchSize
                );

                return generatePayments(orderBatch, startIndex);
            },
            async (batch) => {
                await Payment.insertMany(batch);
            }
        );

        const endTime = performance.now();

        console.log("Database seeding completed successfully!");

        console.log(
            `Total execution time: ${(endTime - startTime).toFixed(2)} ms`
        );

    } catch (error) {
        console.error("Database seeding failed:", error);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
        console.log("Database connection closed.");
    }
};

seedDatabase();