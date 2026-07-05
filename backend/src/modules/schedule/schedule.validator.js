import { body } from 'express-validator'
import { validateRequest } from '../../middlewares/validator.middleware.js'
export const scheduleValidator = [
    body('idUser')
        .notEmpty()
        .withMessage('idUser tidak boleh kosong'),

    body('idClass')
        .notEmpty()
        .withMessage('idClass tidak boleh kosong'),

    body('idSubject')
        .notEmpty()
        .withMessage('idSubject tidak boleh kosong'),

    body('idSemester')
        .notEmpty()
        .withMessage('idSemester tidak boleh kosong'),

    body('day')
        .notEmpty()
        .withMessage('day tidak boleh kosong'),

    body('timeStart')
        .notEmpty()
        .withMessage('timeStart tidak boleh kosong')
        .isTime()
        .withMessage('Format waktu tidak sesuai'),

    body('timeEnd')
        .notEmpty()
        .withMessage('timeEnd tidak boleh kosong')
        .isTime()
        .withMessage('Format waktu tidak sesuai'),

    validateRequest

]