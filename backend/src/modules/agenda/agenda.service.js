import { BadRequestError } from '../../utils/errors/badRequestError.js'
import { NotFoundError } from '../../utils/errors/notFoundError.js'
export class AgendaService {
    #agendaModel
    #agendaDetailModel
    #connection
    #semesterModel
    constructor(agendaModel, agendaDetailModel, semesterModel, connection) {
        this.#connection = connection
        this.#agendaModel = agendaModel
        this.#agendaDetailModel = agendaDetailModel
        this.#semesterModel = semesterModel
    }
    async create(dataAgenda, dataDetail) {
        let main = null

        let isAgendaExist = await this.#agendaModel.findExistAgenda(dataAgenda.id_schedule, dataAgenda.date)

        if(isAgendaExist.length > 0){
            throw new BadRequestError()
        }

        try {
            main = await this.#connection()
            await main.beginTransaction()

            let id_agenda = await this.#agendaModel.create(main, dataAgenda)
            let createDetail = await this.#agendaDetailModel.create(main,
                dataDetail.map(d =>
                    [
                        id_agenda,
                        d.id_class_member,
                        d.status_attendance,
                        d.note || ''
                    ]
                )
            )

            await main.commit()
            let result = await this.#agendaModel.findById(id_agenda)
            console.log(result)
            return {
                success: true,
                message: 'Berhasil menambahkan data',
                data: result
            }

        } catch (err) {
            await main.rollback()
            throw err
        } finally {
            await main.end()
        }
    }

    async findAll(id_user) {
        let semester = await this.#semesterModel.findActive()
        let result = await this.#agendaModel.findAll({id_semester:semester[0].id, id_user})
        console.log(`Dari service : ${id_user}`)

        console.log(`Dari service : ${semester[0].id}`)
        return {
            success: true,
            message: 'Berhasil mendapatkan Data',
            data: result
        }
    }


    async update({ id_agenda, lesson, note }) {
        let agenda = await this.#agendaModel.findById(id_agenda)

        if (!agenda) {
            throw new NotFoundError('Data Tidak Ditemukan')
        }

        let isAgendaExist = await this.#agendaModel.findExistAgenda(dataAgenda.id_schedules, dataAgenda.date)

        if(isAgendaExist.length > 0 && isAgendaExist[0].id != id_agenda){
            throw new BadRequestError()
        }

        let affectedRows = await this.#agendaModel.update({ id_agenda, lesson, note })
        let result = await this.#agendaModel.findById(id_agenda)
        return {
            success: true,
            message: affectedRows > 0 ?
                'Berhasil Memperbarui Data' : 'Gagal Memperbarui Data',
            data: result
        }
    }

    async delete(id_agenda) {
        let isHaveDetail = await this.#agendaModel.findAgendaInDetail(id_agenda)

        if(isHaveDetail.length > 0){
            throw new BadRequestError()
        }

        let affectedRows = await this.#agendaModel.delete(id_agenda)

        return {
            success: true,
            message: affectedRows > 0 ?
                'Berhasil Menghapus Data' : 'Gagal Menghapus Data',
            data: null
        }
    }

    async findById(id_agenda) {
        let result = await this.#agendaModel.findById(id_agenda)

        if (!result) {
            throw NotFoundError('Data Tidak Ditemukan')
        }

        return {
            success: true,
            message: 'Berhasil mendapatkan data',
            data: result
        }
    }
}