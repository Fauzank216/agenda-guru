import { tryCatchWrapper } from '../../utils/tryCatch.wrapper.js'
export class AgendaDetailController {
    #agendaDetailService
    constructor(agendaDetailService) {
        this.#agendaDetailService = agendaDetailService
    }

    findAll = tryCatchWrapper(async (req, res) => {
        let result = await this.#agendaDetailService.findAll(req.params.id_agenda)
        return res.status(200).json(result)

    })

    update = tryCatchWrapper(async (req, res) => {
        let result = await this.#agendaDetailService.update({id:req.params.id_agenda_details, ...req.body})
        return res.status(201).json(result)

    })

    delete = tryCatchWrapper(async (req, res) => {
        let result = await this.#agendaDetailService.delete(req.params.id_agenda_details)
        return res.status(201).json(result)

    })

    findById = tryCatchWrapper(async (req, res) => {
        let result = await this.#agendaDetailService.findById(req.params.id_agenda_details)
        return res.status(200).json(result)
    })

}