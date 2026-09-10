import { validationResult } from "express-validator";
import AppError from "../utils/AppError.js";

// Usage: router.post("/", [body("name").notEmpty(), ...validators], validate, controller)
export default function validate(req, _res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const messages = result.array({ onlyFirstError: true }).map((e) => e.msg);
  next(new AppError(messages[0] || "Invalid request data.", 400));
}
