import express from 'express'
import { AgendaModel } from './agenda.model.js'
import { AgendaDetailModel } from '../agenda_detail/agenda-detail.model.js'
import { AgendaService } from './agenda.service.js'
import { AgendaController } from './agenda.controller.js'
import { agendaValidator } from './agenda.validator.js'
import { runQuery } from '../../utils/tryCatch.wrapper.js'
import { connection } from '../../../config/db/config.db.js'
import { authJwt } from '../../middlewares/auth.middleware.js'
import { authorizationMiddleware } from '../../middlewares/authorisation.middleware.js'
import { SemesterModel } from '../semester/semester.model.js'
export const agendaRouter = express.Router()

const agendaModel = new AgendaModel(runQuery)
const agendaDetailModel = new AgendaDetailModel(runQuery)
const semesterModel = new SemesterModel(runQuery)
const agendaService = new AgendaService(agendaModel, agendaDetailModel, semesterModel, connection)
const agendaController = new AgendaController(agendaService)

agendaRouter.use(authJwt)

agendaRouter.post('/', authorizationMiddleware('teacher'), agendaValidator, agendaController.create)

agendaRouter.get('/', agendaController.findAll)

agendaRouter.patch('/:id_agenda', authorizationMiddleware('teacher'), agendaController.update)

agendaRouter.delete('/:id_agenda', authorizationMiddleware('teacher'), agendaController.delete)