import { body, query, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import { isValid, parse } from "date-fns";

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
    .withMessage("Full Name must be 5 cha racters long"),
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

const validateData = [
  query("age")
    .optional()
    .isIn(["15-25", ">25", null])
    .withMessage('Age must be either "15-25", ">25", or null'),

  query("gender")
    .optional()
    .isIn(["male", "female", null])
    .withMessage('Gender must be either "male", "female", or null'),

  query("startDate")
    .optional()
    .custom((value) => {
      const parsedDate = parse(value, "MM/dd/yyyy", new Date());
      if (!isValid(parsedDate)) {
        throw new Error("Start date must be a valid date in MM/DD/YYYY format");
      }
      return true;
    }),

  query("endDate")
    .optional()
    .custom((value) => {
      const parsedDate = parse(value, "MM/dd/yyyy", new Date());
      if (!isValid(parsedDate)) {
        throw new Error("End date must be a valid date in MM/DD/YYYY format");
      }
      return true;
    }),
];
const validateDataWithFeature = [
  query("feature")
    .notEmpty()
    .isIn(["A", "B", "C", "D", "E", "F"])
    .withMessage(
      'Feature must be one of "A", "B", "C", "D", "E", "F", or null'
    ),

  query("age")
    .optional()
    .isIn(["15-25", ">25", null])
    .withMessage('Age must be either "15-25", ">25", or null'),

  query("gender")
    .optional()
    .isIn(["male", "female", null])
    .withMessage('Gender must be either "male", "female", or null'),

  query("startDate")
    .optional()
    .custom((value) => {
      const parsedDate = parse(value, "MM/dd/yyyy", new Date());
      if (!isValid(parsedDate)) {
        throw new Error("Start date must be a valid date in MM/DD/YYYY format");
      }
      return true;
    }),

  query("endDate")
    .optional()
    .custom((value) => {
      const parsedDate = parse(value, "MM/dd/yyyy", new Date());
      if (!isValid(parsedDate)) {
        throw new Error("End date must be a valid date in MM/DD/YYYY format");
      }
      return true;
    }),
];

export { validateData, validateDataWithFeature };
