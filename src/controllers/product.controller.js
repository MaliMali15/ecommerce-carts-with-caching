import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import { redis } from "../redis.js";

const addProduct = asyncHandler(async (req, res) => {
    const { productname, price } = req.body
    const imagePath = req.file?.path
    console.log(imagePath)
    
    if (!productname || !price) {
        throw new ApiError(400,"Not enough information about product")
    }

    if (!imagePath) {
        throw new ApiError(400,"Invalid image path")
    }
    
    const productImage = await cloudinaryUpload(imagePath)
    
    if (!productImage) {
        throw new ApiError(500,"Something went wrong while uploading image to server")
    }

    const product=await Product.create({
                    productname,
                    price,
                    productImage:productImage.url
    })

    await redis.del("products")
    
    return res.status(200).json(new ApiResponse(
        200,
        product,
        "Product added successfully"
    ))
})

const getProductById = asyncHandler(async(req, res)=> {
    const { productId } = req.params
    
    if (!productId) {
        throw new ApiError(400,"Invalid product id")
    }

    const cache = await redis.get(`product:${productId}`)
    if (cache) {
        return res.status(200).json(new ApiResponse(
            200,
            JSON.parse(cache),
            "Product successfully fetched"
        ))
    }
    const product = await Product.findById(productId)

    if (!product) {
        throw new ApiError(500,"Something went wrong while fetching the product")
    }
    
    await redis.set(`product:${productId}`, JSON.stringify(product), { EX: 15 * 60 })
    
    return res.status(200).json(new ApiResponse(
        200,
        product,
        "Product successfully fetched"
    ))
})

export{addProduct,getProductById}