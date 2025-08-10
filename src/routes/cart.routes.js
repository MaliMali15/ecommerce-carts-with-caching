import { Router } from "express";
import { addToCart, getCart } from "../controllers/cart.controller.js";
import { authUser } from "../middlewares/authorize.middleware.js";

const router = Router()

router.route("/add-item-to-cart/:productId").post(addToCart)
router.route("/get-cart-items/:userId").get(getCart) 

export default router