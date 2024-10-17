import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import {
  createOrUpdatePreference,
  getPreference,
  deletePreference,
} from "../controllers/prefrence.controller.js";

const router = Router();

// @desc Create or update preference
// @route POST /api/v1/preference
// @access Private

router.use(verifyJwt);

router.route("/").post(createOrUpdatePreference);

router.route("/").get(getPreference);

router.route("/").delete(deletePreference);

export default router;
