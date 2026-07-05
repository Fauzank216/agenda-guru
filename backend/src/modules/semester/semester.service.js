import { BadRequestError } from "../../utils/errors/badRequestError.js"

export class SemesterService {
    #semesterModel
    constructor(semesterModel) {
        this.#semesterModel = semesterModel
    }
    async create({ academic_year, date_start, date_end, semester_type }) {
        let insertId = await this.#semesterModel.create({ academic_year, date_start, date_end, semester_type })
        if (!insertId) {
            return {
                success: true,
                message: 'Gagal Menambahkan Data',
                data: []
            }
        }
        let result = await this.#semesterModel.findById(insertId)
        return {
            success: true,
            message: 'Berhasil Menambahkan Data',
            data: result
        }
    }

    async findAll() {
        let result = await this.#semesterModel.findAll()
        return {
            success: true,
            message: 'Berhasil Mendapatkan Data',
            data: result
        }
    }

    async update({ academic_year, date_start, date_end, semester_type, is_active, id_semester }) {
        let semester = await this.#semesterModel.findActive()

        if(semester.length > 0 && semester[0].id != id_semester){
            throw new BadRequestError()
        }

        let affectedRows = await this.#semesterModel.update({ academic_year, date_start, date_end, semester_type, is_active, id_semester })
        if (affectedRows === 0) {
            return {
                success: true,
                message: 'Gagal Memperbarui Data',
                data: []
            }
        }

        let result = await this.#semesterModel.findById(id_semester)
        return {
            success: true,
            message: 'Berhasil Memperbarui Data',
            data: result
        }
    }

    async delete(id_semester) {

        let isHaveSchedule = await this.#semesterModel.findSemesterInSchedule(id_semester)

        if(isHaveSchedule.length > 0){
            throw new BadRequestError()
        }

        let affectedRows = await this.#semesterModel.delete(id_semester)
        if (affectedRows === 0) {
            return {
                success: true,
                message: 'Gagal Menghapus Data',
                data: []
            }
        }
        return {
            success: true,
            message: 'Berhasil Menghapus Data',
            data: null
        }
    }

    async findById(id_semester) {
        let result = await this.#semesterModel.findById(id_semester)
        return {
            success: true,
            message: 'Berhasil Mendapatkan Data',
            data: result
        }
    }
}