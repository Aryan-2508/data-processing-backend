
import mongoose, { Schema } from "mongoose";

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    productName: string;
    quantity: number;
    unitPrice: number;
}

export interface IOrder {
    orderNumber: string;
    customer: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    orderDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        productName: {
            type: String,
            required: true,
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        unitPrice: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        _id: false,
    }
);

const orderSchema = new Schema<IOrder>(
    {
        orderDate: {
            type: Date,
            default: Date.now,
            required: true,
        },
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items: IOrderItem[]) => items.length > 0,
                message: "An order must contain at least one item",
            },
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        orderStatus: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.index({ orderDate: -1 });
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
