import { tryCatchWrapper } from '../../utils/tryCatch.wrapper.js'

export class ScheduleController {
    #scheduleService
    constructor(scheduleService) {
        this.#scheduleService = scheduleService
    }
    create = tryCatchWrapper(async (req, res) => {
        let result = await this.#scheduleService.create(req.body)
        return res.status(201).json(result)
    })

    findAll = tryCatchWrapper(async (req, res) => {
        let id_user = req.user.role == 'teacher' ? req.user.id : ''
        let result = await this.#scheduleService.findAll(id_user)
        
        return res.status(200).json(result)
    })

    update = tryCatchWrapper(async (req, res) => {
        let result = await this.#scheduleService.update({ ...req.body, id_schedule: req.params.id_schedule })
        return res.status(201).json(result)
    })

    delete = tryCatchWrapper(async (req, res) => {
        let result = await this.#scheduleService.delete(req.params.id_schedule)
        return res.status(201).json(result)
    })

    findById = tryCatchWrapper(async (req, res) => {
        let result = await this.#scheduleService.findById(req.params.id_schedule)
        return res.status(200).json(result)
    })
}