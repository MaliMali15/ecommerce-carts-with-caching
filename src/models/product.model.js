import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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

    stock: {
        type: Number,
        required:true
    },

    discount: {
        type: Number
    },

    image: {
        type: String,
        required: true
    }
}, { timestamps: true })

productSchema.plugin(mongooseAggregatePaginate)

export const Product=mongoose.model("Product",productSchema)