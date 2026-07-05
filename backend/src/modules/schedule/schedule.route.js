import express from 'express'
import { authJwt } from "../../middlewares/auth.middleware.js";
import { ScheduleController } from "./schedule.controller.js";
import { ScheduleModel } from "./schedule.model.js";
import { ScheduleService } from "./schedule.service.js";
import { SemesterModel } from '../semester/semester.model.js';
import { runQuery } from "../../utils/tryCatch.wrapper.js";
import { scheduleValidator } from './schedule.validator.js'
import { authorizationMiddleware } from '../../middlewares/authorisation.middleware.js'

export const scheduleRouter = express.Router()

scheduleRouter.use(authJwt)

const scheduleModel = new ScheduleModel(runQuery)
const semesterModel = new SemesterModel(runQuery)
const scheduleService = new ScheduleService(scheduleModel, semesterModel)
const scheduleController = new ScheduleController(scheduleService)

scheduleRouter.post('/', authorizationMiddleware('admin'), scheduleController.create)

scheduleRouter.patch('/:id_schedule', authorizationMiddleware('admin'), scheduleController.update)

scheduleRouter.delete('/:id_schedule', authorizationMiddleware('admin'), scheduleController.delete)

scheduleRouter.get('/', scheduleController.findAll)

scheduleRouter.get('/:id_schedule', authorizationMiddleware('admin'), scheduleController.findById)