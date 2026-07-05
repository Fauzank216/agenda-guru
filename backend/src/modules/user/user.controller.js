import { tryCatchWrapper } from "../../utils/tryCatch.wrapper.js"
export class UserController {
    #userService;
    constructor(userService) {
        this.#userService = userService
    }

    create = tryCatchWrapper(async (req, res, next) => {
        if (req.file) {
            req.body.avatar = req.file.filename || null
        }
        let newUser = await this.#userService.create(req.body)
        return res.status(200).json(newUser)
    })

    findAll = tryCatchWrapper(async (req, res, next) => {
        console.log(req.query)
        let result = await this.#userService.findAll({ ...req.query })
        return res.status(200).json(result)
    })

    update = tryCatchWrapper(async (req, res, next) => {
        let result = await this.#userService.update({ id_user: req.params.id_user, ...req.body })
        return res.status(200).json(result)
    })

    delete = tryCatchWrapper(async (req, res, next) => {
        let result = await this.#userService.delete(req.params.id_user)
        return res.status(200).json(result)
    })

    updatePassword = tryCatchWrapper(async (req, res, next) => {
        let updatedPassword = await this.#userService.updatePassword({ id_user: req.params.id_user, password: req.body.password })
        return res.status(200).json(updatedPassword)
    })

    updateAvatar = tryCatchWrapper(async (req, res, next) => {
        if (req.file) {
            req.body.avatar = req.file.filename
        }
        let updatedAvatar = await this.#userService.updateAvatar({ id_user: req.params.id_user, avatar: req.body.avatar })
        return res.status(200).json(updatedAvatar)
    })

    findByName = tryCatchWrapper(async (req, res, next) => {
        let user = await this.#userService.findByName(req.params.name)
        return res.status(200).json(user)
    })

    findById = tryCatchWrapper(async (req, res, next) => {
        let user = await this.#userService.findById(req.params.id_user)
        return res.status(200).json(user)
    })
}