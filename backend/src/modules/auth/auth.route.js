import express from 'express'
import { AuthController } from './auth.controller.js'
import { loginValidator } from './auth.validator.js'
import { UserModel } from '../user/user.model.js'
import { runQuery } from '../../utils/tryCatch.wrapper.js'
import { AuthService } from './auth.service.js'
export const authRouter = express.Router()

const userModel = new UserModel(runQuery)
const authService = new AuthService(userModel)
const authController = new AuthController(authService)

authRouter.post('/login', authController.login)