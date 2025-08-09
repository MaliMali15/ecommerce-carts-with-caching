import { Router } from "express";
import { addProduct ,getProductById} from "../controllers/product.controller.js";

const router = Router()

router.route("/addProduct").post(addProduct)
router.route("/:productId").get(getProductById)

export default router