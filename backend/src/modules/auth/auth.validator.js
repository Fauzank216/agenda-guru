import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validator.middleware.js";

export const loginValidator = [
    body('email')
        .notEmpty()
        .withMessage('Email tidak boleh kosong')
        .isEmail()
        .withMessage('Email tidak valid'),

    body('password')
        .notEmpty()
        .withMessage('Password tidak boleh kosong')
        .isLength({ min: 5 })
        .withMessage('Password minimal 5 karakter'),

    validateRequest
]

const registerValidator = [
    body('Username')
        .notEmpty()
        .withMessage('Username wajib diisi'),

    body('Email')
        .notEmpty()
        .withMessage('Email tidak boleh kosong')
        .isEmail()
        .withMessage('Email tidak valid'),

    body('Password')
        .notEmpty()
        .withMessage('Password tidak boleh kosong')
        .isLength({ min: 5 })
        .withMessage('Password minimal 5 karakter'),

    validateRequest

]