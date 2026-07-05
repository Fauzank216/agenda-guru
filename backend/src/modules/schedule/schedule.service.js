import { BadRequestError } from "../../utils/errors/badRequestError.js";
import { NotFoundError } from "../../utils/errors/notFoundError.js";
import { SemesterModel } from "../semester/semester.model.js";
export class ScheduleService {
    #scheduleModel
    #semesterModel
    constructor(scheduleModel, semesterModel) {
        this.#scheduleModel = scheduleModel
        this.#semesterModel = semesterModel
    }

    async create({ id_user, id_class, id_subject, id_semester, day, time_start, time_end }) {
        let semester = await this.#semesterModel.findActive()

        if (time_end < time_start) {
            throw new BadRequestError("Data tidak valid")
        }

        let isScheduleExist = await this.#scheduleModel.findExistSchedule({ id_semester: semester[0].id, id_class, id_user, day, time_start, time_end })

        if (isScheduleExist.length > 0) {
            throw new BadRequestError("Data tidak valid")
        }

        let insertId = await this.#scheduleModel.create({ id_user, id_class, id_subject, id_semester: semester[0].id, day, time_start, time_end })

        let result = await this.#scheduleModel.findById(insertId)

        return {
            success: true,
            message: 'Berhasil Menambahkan data',
            data: result
        }
    }

    async findAll(id_user) {
        let semester = await this.#semesterModel.findActive()

        if (semester.length == 0) {
            return {
                success: true,
                message: 'Belum Ada Jadwal di Semester Ini'
            }
        }

        let result = await this.#scheduleModel.findAll({ id_semester: semester[0].id, id_user })
        return {
            success: true,
            message: 'Berhasil Mendapatkan Data',
            data: result
        }
    }

    async update({ id_user, id_class, id_subject, id_semester, day, time_start, time_end, id_schedule }) {

        let semester = await this.#semesterModel.findActive()

        if (time_end < time_start) {
            throw new BadRequestError("Data tidak valid")
        }

        let isScheduleExist = await this.#scheduleModel.findExistSchedules({ id_semester: semester[0].id, id_class, id_user, day, time_start, time_end })
        
        if (isScheduleExist.length > 0) {
            throw new BadRequestError("Data tidak valid")
        }

        let affectedRows = await this.#scheduleModel.update({ id_user, id_class, id_subject, id_semester:semester[0].id, day, time_start, time_end, id_schedule })

        let result = await this.#scheduleModel.findById(id_schedule)

        return {
            success: true,
            message: affectedRows > 0 ? 'Berhasil Memperbarui data' : 'Gagal Memperbarui Data',
            data: result
        }
    }

    async delete(id_schedule) {
        let affectedRows = await this.#scheduleModel.delete(id_schedule)
        return {
            success: true,
            message: affectedRows > 0 ? 'Berhasil Menghapus Data' : 'Gagal Menghapus Data',
            data: null
        }
    }

    async findById(id_schedule) {
        let result = await this.#scheduleModel.findById(id_schedule)

        if (!result) {
            throw NotFoundError('Data Tidak Ditemukan')
        }

        return {
            success: true,
            message: 'Berhasil Mendapatkan Data',
            data: result
        }
    }

}