import { Router } from "express";
import { addProduct, getProductById } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/addProduct").post(upload.single("productImage"),addProduct)
router.route("/:productId").get(getProductById)

export default router