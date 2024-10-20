import { Router } from "express";
import { getFeatures, getTrend } from "../controllers/data.controller.js";
import {
  validateData,
  validateDataWithFeature,
} from "../middlewares/validation.middleware.js";
const router = Router();

router.route("/features").get(validateData, getFeatures);
router.route("/trend").get(validateDataWithFeature, getTrend);

export default router;
