import { HttpError } from "./httpError.js"
export class UnauthorizedError extends HttpError {
    constructor(message = '401 Unauthorized') {
        super(message)
        this.statusCode = 401
    }
}