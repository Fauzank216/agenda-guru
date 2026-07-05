import { validationResult } from "express-validator"
export const validateRequest = async (req, res, next) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: result.mapped()
    })
  }
  next()
}