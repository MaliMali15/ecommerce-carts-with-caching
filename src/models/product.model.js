import mongoose, { Schema } from "mongoose";


const productSchema = new Schema({
    productname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    
    price: {
        type: String,
        required: true
    },

    productImage: {
        type: String,
        required: true
    }
}, { timestamps: true })



export const Product=mongoose.model("Product",productSchema)