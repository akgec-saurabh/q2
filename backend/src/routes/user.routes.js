import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import { validateRegistration } from "../middlewares/validation.middleware.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(validateRegistration, registerUser);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
