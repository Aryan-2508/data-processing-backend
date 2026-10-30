import mongoose, { Schema } from "mongoose";

export interface IPayment {
    order: mongoose.Types.ObjectId;
    transactionId: string;
    amount: number;
    currency: string;
    paymentMethod: "card" | "upi" | "netbanking" | "cod";
    status: "pending" | "success" | "failed" | "refunded";
    paymentDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const paymentSchema = new Schema<IPayment>(
    {
        order: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: "INR",
            uppercase: true,
            trim: true,
        },
        paymentMethod: {
            type: String,
            enum: ["card", "upi", "netbanking", "cod"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "success", "failed", "refunded"],
            default: "pending",
        },
        paymentDate: {
            type: Date,
            default: Date.now,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

paymentSchema.index({ order: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ paymentDate: -1 });

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;