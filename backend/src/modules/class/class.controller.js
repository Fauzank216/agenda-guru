import { tryCatchWrapper } from "../../utils/tryCatch.wrapper.js"
export class ClassController {
    #classService
    constructor(classService) {
        this.#classService = classService
    }

    create = tryCatchWrapper(async (req, res) => {
        let result = await this.#classService.create(req.body)
        return res.status(201).json(result)
    })

    update = tryCatchWrapper(async (req, res) => {
        let result = await this.#classService.update({ id_class: req.params.id_class, ...req.body })
        return res.status(201).json(result)
    })

    delete = tryCatchWrapper(async (req, res) => {
        let result = await this.#classService.delete(req.params.id_class)
        return res.status(201).json(result)
    })

    findAll = tryCatchWrapper(async (req, res) => {
        let result = await this.#classService.findAll({ ...req.query })
        return res.status(200).json(result)
    })

    findById = tryCatchWrapper(async (req, res) => {
        let result = await this.#classService.findById(req.params.id_class)
        return res.status(200).json(result)
    })
}