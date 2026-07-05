export class AgendaDetailService {
    #agendaDetailModel
    constructor(agendaDetailModel) {
        this.#agendaDetailModel = agendaDetailModel
    }

    async findAll(id_agenda) {
        let result = await this.#agendaDetailModel.findAll(id_agenda)
        return {
            success: true,
            message: 'Berhasil Mendapatkan Data',
            data: result
        }
    }

    async update({ id, status_attendance, note }) {
        let agenda_details = await this.#agendaDetailModel.findById(id)

        if (!agenda_details) {
            throw notFoundError('Data Tidak Ditemukan')
        }

        let affectedRows = await this.#agendaDetailModel.update({ id, status_attendance, note})

        let result = await this.#agendaDetailModel.findById(id)
        return {
            success: true,
            message: affectedRows > 0 ? 'Berhasil Memperbarui Data' : 'Gagal Memperbarui Data',
            data: result
        }
    }

    async findById(id_agenda_details) {
        let result = await this.#agendaDetailModel.findById(id_agenda_details)

        if (!result) {
            throw notFoundError('Data Tidak Ditemukan')
        }

        return {
            success: true,
            message: 'Berhasil Mendapatkan Data',
            data: result
        }
    }

    async findByAgendaId(id_agenda) {
        let agenda = await AgendaModel.findById(id_agenda)

        if (!agenda) {
            throw notFoundError('Data Tidak Ditemukan')
        }

        let details = await this.#agendaDetailModel.findByAgendaId(id_agenda)

        return {
            success: true,
            message: 'Berhasil Mendapatkan Data',
            data: {
                ...agenda[0],
                details
            }
        }
    }

    async delete(id_agenda_details) {
        let affectedRows = await this.#agendaDetailModel.delete(id_agenda_details)

        return {
            success: true,
            message: affectedRows > 0 ? 'Berhasil Menghapus Data' : 'Gagal Menghapus Data',
            data: null
        }
    }
}