import { ClassMemberController } from "./class-member.controller.js";
import { ClassMemberModel } from "./class-member.model.js";
import { ClassMemberService } from "./class-member.service.js";
import { runQuery } from "../../utils/tryCatch.wrapper.js";
import express from 'express'
import { authJwt } from "../../middlewares/auth.middleware.js";
import { authorizationMiddleware } from "../../middlewares/authorisation.middleware.js";
import { SemesterModel } from "../semester/semester.model.js";

export const classMemberRouter = express.Router()

const classMemberModel = new ClassMemberModel(runQuery)
const semesterModel = new SemesterModel(runQuery)
const classMemberService = new ClassMemberService(classMemberModel, semesterModel)
const classMemberController = new ClassMemberController(classMemberService)

classMemberRouter.use(authJwt)

classMemberRouter.post('/', authorizationMiddleware('admin'), classMemberController.create)

classMemberRouter.put('/:id_class_member', authorizationMiddleware('admin'), classMemberController.update)

classMemberRouter.delete('/:id_class_member', authorizationMiddleware('admin'), classMemberController.delete)

classMemberRouter.get('/:id_class', classMemberController.findAll)