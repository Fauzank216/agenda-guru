import { body } from "express-validator";
import {validateRequest} from '../../middlewares/validator.middleware'
export const classMemberValidator = [
    body("id_class")
    .notEmpty()
    .withMessage('id_class tidak boleh kosong'),

    body("id_student")
    .notEmpty()
    .withMessage('id_student tidak boleh kosong'),

    validateRequest
]