import { tryCatchWrapper } from '../../utils/tryCatch.wrapper.js'
export class StudentController {
    #studentService
    constructor(studentService) {
        this.#studentService = studentService
    }

    create = tryCatchWrapper(async (req, res) => {

        if (req.file) {
            req.body.avatar = req.file.filename
        }

        let result = await this.#studentService.create(req.body)
        return res.status(200).json(result)
    })

    findAll = tryCatchWrapper(async (req, res) => {
        let result = await this.#studentService.findAll(req.query)
        return res.status(200).json(result)
    })

    update = tryCatchWrapper(async (req, res) => {
        let result = await this.#studentService.update({ ...req.body, id_student: req.params.id_student })
        return res.status(200).json(result)
    })

    delete = tryCatchWrapper(async (req, res) => {
        let result = await this.#studentService.delete(req.params.id_student)
        return res.status(200).json(result)

    })

    updateAvatar = tryCatchWrapper(async (req, res) => {
        if (req.file) {
            req.body.avatar = req.file.filename
        }

        let result = await this.#studentService.updateAvatar({ avatar: req.body.avatar, id_student: req.params.id_student })
        return res.status(200).json(result)
    })

    findById = tryCatchWrapper(async (req, res) => {
        let result = await this.#studentService.findById(req.params.id_student)
        return res.status(200).json(result)
    })
}