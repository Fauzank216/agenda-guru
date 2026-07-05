import express from 'express'
import { ClassModel } from './class.model.js'
import { SemesterModel } from '../semester/semester.model.js'
import { ClassService } from './class.service.js'
import { ClassController } from './class.controller.js'
import { runQuery } from '../../utils/tryCatch.wrapper.js'
import { authJwt } from '../../middlewares/auth.middleware.js'
import { authorizationMiddleware } from '../../middlewares/authorisation.middleware.js'
export const classRouter = express.Router()

const classModel = new ClassModel(runQuery)
const semesterModel = new SemesterModel(runQuery)
const classService = new ClassService(classModel,  semesterModel)
const classController = new ClassController(classService)

classRouter.use(authJwt)

classRouter.post('/', authorizationMiddleware('admin'), classController.create)

classRouter.patch('/:id_class', authorizationMiddleware('admin'), classController.update)

classRouter.delete('/:id_class', authorizationMiddleware('admin'), classController.delete)

classRouter.get('/', authorizationMiddleware('admin'), classController.findAll)