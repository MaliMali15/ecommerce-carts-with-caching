import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"

const generateAccessandRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
        
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating tokens")
    }
}

const options = {
    httpOnly: true,
    secure: true
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    
    if ([username, email, password].some((field) => field.trim() === "")) {
        throw new ApiError(400,"Missing credentials")
    }

    const existingUser = await User.findOne({
        $or:[{username},{email}]
    })

    if (existingUser) {
        throw new ApiError(400,"User already exists")
    }

    const user=await User.create({
        username: username.toLowerCase(),
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    
    if (!createdUser) {
        throw new ApiError(404,"User not found")
    }

    return res.status(200).json(new ApiResponse(
        201,
        createdUser,
        "User registered successfully"
    ))

})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    
    if (!email || !password) {
        throw new ApiError(400,"Missing credentials")
    }

    const user=await User.findOne({email})
    
    if (!user) {
        throw new ApiError(404,"User doesn't exist")
    }

    if (!await isPassCorrect(password)) {
        throw new ApiError(400,"Incorrect Password")
    }

    const { accessToken, refreshToken } = generateAccessandRefreshToken(user._id)

    const loggedInUser=User.findOne({refreshToken}).select("-password -refreshToken")
    
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            {
                loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
    ))

})

const tokenRefresher = asyncHandler(async (req, res) => {
    const token = req.body.refreshToken || req.cookies.refreshToken
    
    if (!token) {
        throw new ApiError(400,"Invalid token")
    }

    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY)

    const user =await User.findById(decodedToken._id)
    
    if (token !== user.refreshToken) {
        throw new ApiError(401,"Refresh Token expired")
    }

    const { accessToken, refreshToken } = generateAccessandRefreshToken(user._id)
    
    return res.status(200)
        .cookie("accesToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            {
                accessToken,
                refreshToken
            },
            "Tokens refreshed successfully"
    ))
})

const logoutUser = asyncHandler(async (req, res) => {
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken:1
            }
        },
        {
            new: true
        }
    )

    return res.status(200)
        .clearCookie("accesToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(
            204,
            {},
            "User successfully logged out"
    ))
    
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user
    
    return res.status(200).json(new ApiResponse(
        200,
        user,
        "User information fetched successfully"
    ))
})

export {registerUser,loginUser,tokenRefresher,logoutUser,getCurrentUser}