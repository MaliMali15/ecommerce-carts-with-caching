import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { redis } from "../redis.js";
import mongoose from "mongoose";

const addToCart = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const userId = req.user._id
    
    if (!productId) {
        throw new ApiError(400,"Invalid product id")
    }

    if (!await Product.findById(productId)) {
        throw new ApiError(404,"Product doesnt exist")
    }

    const existingCart = await Cart.findOne({
        owner:userId,
        product:productId
    })
    
    if (existingCart) {
        throw new ApiError("Product already added to cart")
    }

    let cart = await Cart.findOne({ owner: userId })
    
    if (!cart) {
        cart = await Cart.create({
            owner: userId,
            products:productId
        })
    } else {
        cart.products.push(productId)
        await cart.save()
    }

    await redis.del(`cart:${userId}`)

    return res.status(200).json(new ApiResponse(
        200,
        cart,
        "Product added to cart successfully"
    ))
})

const getCart = asyncHandler(async (req, res) => {
    const {userId} = req.params
    
    if (!userId) {
        throw new ApiError(404,"User doesnt exist")
    }

    const cache = await redis.get(`cart:${userId.toString()}`)
    
    if (cache) {
        return res.status(200).json(new ApiResponse(
        200,
        JSON.parse(cache),
        "Cart items fetched successfully"
    ))
    } 

    const cart = await Cart.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "products",
                foreignField: "_id",
                as:"products"
            }
        },
        {
            $addFields: {
                products: "$products"
            }
        }
    ])

    
    await redis.set(`cart:${userId.toString()}`,JSON.stringify(cart[0]),{EX:60*1})
    

    return res.status(200).json(new ApiResponse(
        200,
        cart[0],
        "Cart items fetched successfully"
    ))
})

export{addToCart,getCart}