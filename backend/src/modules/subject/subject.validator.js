import {body} from 'express-validator'
import {validateRequest} from '../../middlewares/validator.middleware.js'
export const subjectValidator = [
    body('subject_name')
    .isEmpty()
    .withMessage('Name subject tidak boleh kosong'),

    validateRequest
]