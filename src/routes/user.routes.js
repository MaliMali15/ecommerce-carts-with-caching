import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, tokenRefresher } from "../controllers/user.controller.js";
import { authUser } from "../middlewares/authorize.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/current-user").get(authUser,getCurrentUser)
router.route("/logout").post(authUser, logoutUser)
router.route("/refresh-token").post(tokenRefresher)

export default router