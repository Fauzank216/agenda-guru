import express from 'express'
import { SemesterService } from './semester.service.js'
import { SemesterModel } from './semester.model.js'
import { runQuery } from '../../utils/tryCatch.wrapper.js'
import { SemesterController } from './semester.controller.js'
import { semesterValidator } from './semester.validator.js'
import { authJwt } from '../../middlewares/auth.middleware.js'
import { authorizationMiddleware } from '../../middlewares/authorisation.middleware.js'

export const semesterRouter = express.Router()

const semesterModel = new SemesterModel(runQuery)
const semesterService = new SemesterService(semesterModel)
const semesterController = new SemesterController(semesterService)

semesterRouter.use(authJwt)

semesterRouter.post('/', authorizationMiddleware('admin'), semesterController.create)

semesterRouter.patch('/:id_semester', authorizationMiddleware('admin'), semesterController.update)

semesterRouter.delete('/:id_semester', authorizationMiddleware('admin'), semesterController.delete)

semesterRouter.get('/', authorizationMiddleware('admin'), semesterController.findAll)
