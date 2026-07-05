import { UnauthorizedError } from "../utils/errors/unauthorizedError.js"

export function authorizationMiddleware (role){
    return (req, res, next) =>{
        if(req.user.role != role){
            throw new UnauthorizedError('Unauthorized')
        }
        next()
    }
}