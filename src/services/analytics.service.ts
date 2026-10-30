import Customer from "../models/customer.model";
import Product from "../models/product.model";
import Order from "../models/order.model";
import Payment from "../models/payment.model";

export const getDashboardAnalytics = async () => {

    const startTime = performance.now();

    const [
        totalCustomers,
        totalProducts,
        totalOrders,
        pendingOrders,
        successfulPayments,
        revenueResult,
    ] = await Promise.all([

        Customer.countDocuments(),

        Product.countDocuments(),

        Order.countDocuments(),

        Order.countDocuments({
            orderStatus: "pending",
        }),

        Payment.countDocuments({
            status: "success",
        }),

        Payment.aggregate([
            {
                $match: {
                    status: "success",
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$amount",
                    },
                },
            },
        ]),

    ]);

    const endTime = performance.now();

    const executionTime = endTime - startTime;

    return {
        totalCustomers,
        totalProducts,
        totalOrders,
        totalRevenue: revenueResult[0]?.totalRevenue ?? 0,
        pendingOrders,
        successfulPayments,
        executionTime: `${executionTime.toFixed(2)} ms`,
    };
};