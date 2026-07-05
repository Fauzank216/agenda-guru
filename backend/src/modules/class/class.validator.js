import { body } from "express-validator"
import { validateRequest } from "../../middlewares/validator.middleware.js"

export const classValidator = [
    body("name")
    .notEmpty()
    .withMessage("name Tidak Boleh Kosong"),

    body("id_major")
    .notEmpty()
    .withMessage("id_major Tidak Boleh kosong"),

    body("grade")
    .notEmpty()
    .withMessage("grade Tidak Boleh Kosong"),
    
    validateRequest
]