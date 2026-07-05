import { tryCatchWrapper } from "../../utils/tryCatch.wrapper.js";
export class ClassMemberController {
    #classMemberService
    constructor(classMemberService) {
        this.#classMemberService = classMemberService
    }

    create = tryCatchWrapper(async (req, res) => {
        let result = await this.#classMemberService.create(req.body)
        console.log(result)
        return res.status(201).json(result)
    })

    update = tryCatchWrapper(async (req, res) => {
        let result = await this.#classMemberService.update({ ...req.body, id_class_member: req.params.id_class_member })
        return res.status(201).json(result)
    })

    delete = tryCatchWrapper(async (req, res) => {
        let result = await this.#classMemberService.delete(req.params.id_class_member)
        return res.status(201).json(result)
    })

    findById = tryCatchWrapper(async (req, res) => {
        let result = await this.#classMemberService.findById(req.params)
        return res.status(200).json(result)
    })

    findAll = tryCatchWrapper(async (req, res) => {
        let result = await this.#classMemberService.findAll(req.params)
        return res.status(200).json(result)
    })
}