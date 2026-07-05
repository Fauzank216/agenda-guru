import express from 'express'
import { ReportController } from './report.controller.js'
import { ReportService } from './report.service.js'
import { ReportModel } from './report.model.js'
import { SemesterModel } from '../semester/semester.model.js'
import { runQuery } from '../../utils/tryCatch.wrapper.js'
export const reportRouter = express.Router()

const reportModel = new ReportModel()
const semesterModel = new SemesterModel(runQuery)
const reportService = new ReportService(reportModel, semesterModel)
const reportController = new ReportController(reportService)

reportRouter.get('/recap', reportController.findRecap)
// reportRouter.get('/student/:id_class_member/range', reportController.findStudentReport)
// reportRouter.get('/class/:id_class/range', reportController.findClassReport)
