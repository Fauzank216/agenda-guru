import express from 'express'
import { uploadImgHandler } from '../../utils/upload-img.handler.js'
import { StudentController } from "./student.controller.js";
import { StudentModel } from './student.model.js';
import { SemesterModel } from '../semester/semester.model.js';
import { StudentService } from './student.service.js'
import { runQuery } from '../../utils/tryCatch.wrapper.js';
import { authJwt } from '../../middlewares/auth.middleware.js';
import { authorizationMiddleware } from '../../middlewares/authorisation.middleware.js';
export const studentRouter = express.Router()

const upload = uploadImgHandler()

studentRouter.use(authJwt)

const studentModel = new StudentModel(runQuery)
const semesterModel = new SemesterModel(runQuery)
const studentService = new StudentService(studentModel, semesterModel)
const studentController = new StudentController(studentService)

studentRouter.post('/', authorizationMiddleware('admin'), upload.single('avatar'), studentController.create)

studentRouter.patch('/profile/:id_student', authorizationMiddleware('admin'), studentController.update)
studentRouter.patch('/avatar/:id_student', authorizationMiddleware('admin'), upload.single('avatar'), studentController.updateAvatar)

studentRouter.delete('/:id_student', authorizationMiddleware('admin'), studentController.delete)

studentRouter.get('/', authorizationMiddleware('admin'), studentController.findAll)
studentRouter.get('/:id_student', authorizationMiddleware('admin'), studentController.findById)
studentRouter.get('/search', authorizationMiddleware('admin'), studentController.findAll)