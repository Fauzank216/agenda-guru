import { HttpError } from "./httpError.js"
export class BadRequestError extends HttpError {
    constructor(message = '400 Not Found') {
        super(message)
        this.statusCode = 400
    }
}