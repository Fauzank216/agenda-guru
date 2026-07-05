import { body } from "express-validator";
import {validateRequest} from '../../middlewares/validator.middleware.js'
export const semesterValidator = [
    body('academic_year')
    .notEmpty()
    .withMessage('academic_year tidak boleh kosong'),

    body('date_start')
    .notEmpty()
    .withMessage('date_start tidak boleh kosong'),

    body('date_end')
    .notEmpty()
    .withMessage('date_end tidak boleh kosong'),

    validateRequest
]