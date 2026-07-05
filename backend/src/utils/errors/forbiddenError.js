import { HttpError } from "./httpError.js"
export class ForbiddenError extends HttpError {
    constructor(message = '404 Not Found') {
        super(message)
        this.statusCode = 404
    }
}

