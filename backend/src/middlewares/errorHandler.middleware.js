export const errorHandlerMiddleware = (err, req, res, next) => {
    const message = err.message || "Internal server error"
    const statusCode = err.statusCode || 500
    console.log(err)
    return res.status(statusCode).json({
        success:false,
        message,
    })
}