import { body } from "express-validator";
import {validateRequest} from '../../middlewares/validator.middleware.js'

export const validateAgendaDetail = [
    body('id_agenda')
    .isEmpty()
    .withMessage('id_agenda tidak boleh kosong'),

    body('id_class_member')
    .isEmpty()
    .withMessage('id_class_member tidak boleh kosong'),

    body('status_attandance')
    .isEmpty()
    .withMessage('Status absen tidak boleh kosong'),

    body('id_student')
    .isEmpty()
    .withMessage('id_student tidak boleh kosong'),

    validateRequest

]