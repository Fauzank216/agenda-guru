import { tryCatchWrapper } from "../../utils/tryCatch.wrapper.js";
export class SemesterController {
    #semesterService
    constructor(semesterService) {
        this.#semesterService = semesterService
    }
    create = tryCatchWrapper(async (req, res) => {
        let result = await this.#semesterService.create(req.body)
        return res.status(201).json(result)
    })

    update = tryCatchWrapper(async (req, res) => {
        let result = await this.#semesterService.update({ ...req.body, id_semester: req.params.id_semester })
        return res.status(201).json(result)
    })

    delete = tryCatchWrapper(async (req, res) => {
        let result = await this.#semesterService.delete(req.params.id_semester)
        return res.status(201).json(result)
    })

    findById = tryCatchWrapper(async (req, res) => {
        let result = await this.#semesterService.findById(req.params.id_semester)
        return res.status(200).json(result)
    })

    findAll = tryCatchWrapper(async (req, res) => {
        let result = await this.#semesterService.findAll()
        return res.status(200).json(result)
    })
}