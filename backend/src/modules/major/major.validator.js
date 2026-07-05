import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validator.middleware.js";

export const majorValidator = [
    body('major_code')
        .notEmpty()
        .withMessage("major_code tidak boleh kosong")
        .isLength({ max: 15 })
        .withMessage("major_code maksimal 15 karakter"),

    body('major_name')
        .isLength({ max: 100 })
        .withMessage("major_name maksimal 100 karakter"),

    validateRequest
]
