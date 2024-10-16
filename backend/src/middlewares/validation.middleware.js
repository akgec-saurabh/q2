import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

const validateRegistration = [
  body("username")
    .trim()
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Username must be 5 characters long"),
  body("email").trim().notEmpty().isEmail().withMessage("Email must be Valid"),
  body("fullName")
    .trim()
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Full Name must be 5 characters long"),
  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Password must be 5 charchters long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      throw new ApiError(400, "Input validation failed", errors.array());
    }
    next();
  },
];

export { validateRegistration };
