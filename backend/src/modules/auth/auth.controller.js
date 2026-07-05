import { UnauthorizedError } from "../../utils/errors/unauthorizedError.js"
import { AuthService } from "./auth.service.js"
const authService = new AuthService()
export class AuthController {
    #authService;
    constructor(authService) {
        this.#authService = authService
     }
    login = async (req, res, next) => {
        const { email, password } = req.body
        try {

            const request = await this.#authService.login(email, password)

            return res.status(200).json(request)

        } catch (err) {
            next(err)
        }

    }
}