import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";

const addProduct = asyncHandler(async (req, res) => {
    const { productname, price } = req.body
    const imagePath=req.file?.productImage?.path
    
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
                    image:productImage.url
                })
    
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

    const product = await Product.findById(productId)

    if (!product) {
        throw new ApiError(500,"Something went wrong while fetching the product")
    }
    
    return res.status(200).json(new ApiResponse(
        200,
        product,
        "Product successfully fetched"
    ))
})

export{addProduct,getProductById}