import express from 'express'
import { authJwt } from '../../middlewares/auth.middleware.js'
import { UserController } from './user.controller.js'
import { UserService } from './user.service.js'
import { UserModel } from './user.model.js'
import { runQuery } from '../../utils/tryCatch.wrapper.js'
import { uploadImgHandler } from '../../utils/upload-img.handler.js'
import { createUserValidator, updatePforileValidator } from './user.validator.js'
import { authorizationMiddleware } from '../../middlewares/authorisation.middleware.js'
export const userRouter = express.Router()

const upload = uploadImgHandler()

const userModel = new UserModel(runQuery)
const userService = new UserService(userModel)
const userController = new UserController(userService)

userRouter.use(authJwt)

userRouter.post('/', authorizationMiddleware('admin'), upload.single('avatar'), userController.create)

userRouter.patch('/profile/:id_user', userController.update)
userRouter.patch('/password/:id_user', userController.updatePassword)
userRouter.patch('/avatar/:id_user', upload.single('avatar'), userController.updateAvatar)

userRouter.delete('/:id_user', authorizationMiddleware('admin'), userController.delete)

userRouter.get('/', authorizationMiddleware('admin'), userController.findAll)

userRouter.get('/search', authorizationMiddleware('admin'), userController.findAll)

userRouter.get('/:id_user', authorizationMiddleware('admin'), userController.findById)
