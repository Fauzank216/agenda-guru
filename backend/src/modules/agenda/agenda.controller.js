import { tryCatchWrapper } from '../../utils/tryCatch.wrapper.js'
export class AgendaController {
    #agendaService
    constructor(agendaService) {
        this.#agendaService = agendaService
    }

    create = tryCatchWrapper(async (req, res) => {
        let id_user = req.user.id
        let { agendas, details } = req.body
        console.log(agendas)
        let result = await this.#agendaService.create({id_user,...agendas}, details)
        return res.status(201).json(result)
    })

    findAll = tryCatchWrapper(async (req, res) => {
        let id_user = req.user.role == 'teacher' ? req.user.id : ''
        console.log(`Dari controller : ${id_user}`)
        let result = await this.#agendaService.findAll(id_user)
        console.log(result)
        return res.status(200).json(result)
    })

    update = tryCatchWrapper(async (req, res) => {
        let result = await this.#agendaService.update({ id_agenda: req.params.id_agenda,...req.body })
        return res.status(201).json(result)

    })

    delete = tryCatchWrapper(async (req, res) => {
        let result = await this.#agendaService.delete(req.params.id_agenda)
        return res.status(201).json(result)

    })

    findById = tryCatchWrapper(async (req, res) => {
        let result = await this.#agendaService.findById(req.params.id_agenda)
        return res.status(200).json(result)
    })

}