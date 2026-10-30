
import mongoose, { Schema } from "mongoose";

export interface ICustomer {
    name: string;
    email: string;
    phone?: string;
    city?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const customerSchema = new Schema<ICustomer>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

customerSchema.index({ city: 1, isActive: 1 });

const Customer = mongoose.model<ICustomer>(
    "Customer",
    customerSchema
);

export default Customer;
