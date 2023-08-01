import { Router } from "express";
import { login, register } from "../controllers/users";
import { body } from "express-validator";

const router = Router();
router.post(
  "/register",
  body("email").isEmail().withMessage("Invalid E-Mail address"),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"
    ),
  body("username")
    .matches(/^[a-zA-Z0-9]{3,20}$/)
    .withMessage(
      "Username can only contain letters and numbers and must be between 3 and 20 characters long"
    ),
  register
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Invalid E-Mail address"),
  body("password").notEmpty().withMessage("Password cannot be empty"),
  login
);

export default router;
