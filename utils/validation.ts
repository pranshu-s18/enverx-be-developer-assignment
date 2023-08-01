import { Request } from "express";
import {
  FieldValidationError,
  Result,
  validationResult,
} from "express-validator";

export const handleValidation = (req: Request): Object | null => {
  const errors = validationResult(req) as Result<FieldValidationError>;
  if (!errors.isEmpty()) {
    return errors.array().reduce((acc, e) => ({ ...acc, [e.path]: e.msg }), {});
  } else {
    return null;
  }
};
