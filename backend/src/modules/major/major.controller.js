import { tryCatchWrapper } from "../../utils/tryCatch.wrapper.js"
import { MajorService } from "./major.service.js"
export class MajorController {
    static create = tryCatchWrapper(async function (req, res, next) {
        const result = await MajorService.create(req.body)
        return res.status(201).json(result)
    })
    
    static findAll = tryCatchWrapper(async function (req, res, next) {
        const result = await MajorService.findAll()
        return res.status(200).json(result)
    })

    static findById = tryCatchWrapper(async function (req, res, next) {
        const result = await MajorService.findById(req.params.id_major)
        return res.status(200).json(result)
    })

    static update = tryCatchWrapper(async function (req, res, next) {
        let result = await MajorService.update({ ...req.body, id_major: req.params.id_major })
        return res.status(201).json(result)

    })

    static delete = tryCatchWrapper(async function (req, res, next) {
        let result = await MajorService.delete(req.params.id_major)
        return res.status(201).json(result)
    })
}