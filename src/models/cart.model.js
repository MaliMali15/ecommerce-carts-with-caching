import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
    owner: {
        type:Schema.Types.ObjectId,
        ref:"User"
    },

    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
})

export const Cart=mongoose.model("Cart",cartSchema)