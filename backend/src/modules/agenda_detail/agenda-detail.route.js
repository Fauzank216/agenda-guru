import express from 'express'
import { AgendaDetailController } from './agenda-detail.controller.js'
import { AgendaDetailModel } from './agenda-detail.model.js'
import { AgendaDetailService } from './agenda-detail.service.js'
import { runQuery } from '../../utils/tryCatch.wrapper.js'
import { authJwt } from '../../middlewares/auth.middleware.js'
export const agendaDetailRouter = express.Router()

const agendaDetailModel = new AgendaDetailModel(runQuery)
const agendaDetailService = new AgendaDetailService(agendaDetailModel)
const agendaDetailController = new AgendaDetailController(agendaDetailService)

agendaDetailRouter.get('/:id_agenda', agendaDetailController.findAll)

agendaDetailRouter.patch('/:id_agenda_details', agendaDetailController.update)

agendaDetailRouter.delete('/:id_agenda_details', agendaDetailController.delete)