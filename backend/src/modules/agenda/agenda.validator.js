import { body } from "express-validator";
import {validateRequest} from '../../middlewares/validator.middleware.js'

export const agendaValidator = [
    body('idSchedule')
    .isEmpty()
    .withMessage('idSchedule tidak boleh kosong'),

    body('note')
    .isEmpty()
    .withMessage('note tidak boleh kosong')
]