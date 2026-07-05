import { SubjectController } from "./subject.controller.js";
import { SubjectModel } from "./subject.model.js";
import { SubjectService } from "./subject.service.js";
import { runQuery } from "../../utils/tryCatch.wrapper.js";
import { subjectValidator } from "./subject.validator.js";
import express from 'express'
import { authJwt } from "../../middlewares/auth.middleware.js";
import { authorizationMiddleware } from "../../middlewares/authorisation.middleware.js";

export const subjectRouter = express.Router()

const subjectModel = new SubjectModel(runQuery)
const subjectService = new SubjectService(subjectModel)
const subjectController = new SubjectController(subjectService)

subjectRouter.use(authJwt)

subjectRouter.post('/', authorizationMiddleware('admin'), subjectController.create)

subjectRouter.get('/', authorizationMiddleware('admin'), subjectController.findAll)

subjectRouter.patch('/:id_subject', authorizationMiddleware('admin'), subjectController.update)

subjectRouter.delete('/:id_subject', authorizationMiddleware('admin'), subjectController.delete)