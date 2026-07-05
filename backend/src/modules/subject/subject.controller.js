import { tryCatchWrapper } from "../../utils/tryCatch.wrapper.js";

export class SubjectController {
    #subjectService
    constructor(subjectService) {
        this.#subjectService = subjectService
    }
    
    create = tryCatchWrapper(async (req, res) => {
        let result = await this.#subjectService.create(req.body)
        return res.status(201).json(result)
    })

    findAll = tryCatchWrapper(async (req, res) => {
        let result = await this.#subjectService.findAll()
        return res.status(200).json(result)

    })

    update = tryCatchWrapper(async (req, res) => {
        let result = await this.#subjectService.update({ ...req.body, id_subject: req.params.id_subject })
        return res.status(201).json(result)
    })

    delete = tryCatchWrapper(async (req, res) => {
        let result = await this.#subjectService.delete(req.params.id_subject)
        return res.status(201).json(result)

    })

    findbyId = tryCatchWrapper(async (req, res) => {
        let result = await this.#subjectService.findById(req.params.id_subject)
        return res.status(200).json(result)

    })
} 