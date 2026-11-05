
import mongoose, { Schema } from "mongoose";

export interface IProduct {
    name: string;
    sku: string;
    description?: string;
    price: number;
    category: string;
    tags: string[];
    stock: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
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

productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ tags: 1 });

const Product = mongoose.model<IProduct>(
    "Product",
    productSchema
);

export default Product;
