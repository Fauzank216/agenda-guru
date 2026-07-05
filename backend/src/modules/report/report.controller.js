import { tryCatchWrapper } from "../../utils/tryCatch.wrapper.js"
export class ReportController {
    #reportService
    constructor(reportService) {
        this.#reportService = reportService
    }

    findRecap = tryCatchWrapper(async (req, res) => {
        let result = await this.#reportService.findRecap(req.query)
        return res.status(200).json(result)
    })

    findStudentReport = tryCatchWrapper(async (req, res) => {
        let result = await this.#reportService.findStudentReport({...req.query, id_class_member:req.params.id_class_member})
        console.log(req.query)
        return res.status(200).json(result)
    })

    findClassReport = tryCatchWrapper(async (req, res) => {
        let result = await this.#reportService.findClassReport({...req.query, id_class:req.params.id_class})
        return res.status(200).json(result)
    })
}