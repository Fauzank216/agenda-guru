import express from 'express'
import { MajorController } from './major.controller.js'
import { majorValidator } from './major.validator.js'
import { authJwt } from '../../middlewares/auth.middleware.js'
import { authorizationMiddleware } from '../../middlewares/authorisation.middleware.js'
export const majorRouter = express.Router()

majorRouter.use(authJwt)

majorRouter.post('/', authorizationMiddleware('admin'),  majorValidator, MajorController.create)

majorRouter.put('/:id_major', authorizationMiddleware('admin'), majorValidator, MajorController.update)

majorRouter.delete('/:id_major', authorizationMiddleware('admin'), MajorController.delete)

majorRouter.get('/', authorizationMiddleware('admin'), MajorController.findAll)

majorRouter.get('/:id_major', authorizationMiddleware('admin'), MajorController.findById)