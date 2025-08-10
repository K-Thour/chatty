import { body } from "express-validator";

const signupValidation = [
  body("name").notEmpty().withMessage("Name is required"),

  body("email").isEmail().withMessage("Invalid email format"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
    .withMessage(
      "Password must include one uppercase letter, one number, and one special character"
    )
    .notEmpty()
    .withMessage("Password is required"),
];

export default {
  signupValidation,
};
