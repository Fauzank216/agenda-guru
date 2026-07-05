import { body } from "express-validator";

export const studentValidator = [
    body('nisn')
    .isEmpty()
    .withMessage('Nins tidak boleh kosong'),

    body('nama')
    .isEmpty()
    .withMessage('Nama tidak boleh kosong'),
   
    body('gender')
    .isEmpty()
    .withMessage('Gender tidak boleh kosong'),
    
    body('phone_parent')
    .isEmpty()
    .withMessage('No telpon orang tua, wajib diisi'),
]