import { validateRequest } from "../../middlewares/validator.middleware.js"
import { body } from "express-validator"
export const createUserValidator = [
    body("name")
        .notEmpty()
        .withMessage("Nama Tidak Boleh Kosong"),

    body("username")
        .notEmpty()
        .withMessage("Username Tidak Boleh Kosong")
        .isLength({ max: 50 })
        .withMessage("Username Maksimal 50 karakter"),

    body("email")
        .notEmpty()
        .withMessage("Email Tidak Boleh Kosong")
        .isEmail()
        .withMessage("Email Tidak Valid"),

    body("password")
        .notEmpty()
        .withMessage("Password Tidak Boleh Kosong")
        .isLength({ min: 5 })
        .withMessage("Password Minimal 5 karakter"),

    validateRequest

]

export const updatePforileValidator = [
      body("newName")
        .notEmpty()
        .withMessage("Nama Tidak Boleh Kosong"),

    body("newUsername")
        .notEmpty()
        .withMessage("Username Tidak Boleh Kosong")
        .isLength({ max: 50 })
        .withMessage("Username Maksimal 50 karakter"),

    body("newEmail")
        .notEmpty()
        .withMessage("Email Tidak Boleh Kosong")
        .isEmail()
        .withMessage("Email Tidak Valid"),

        validateRequest
]