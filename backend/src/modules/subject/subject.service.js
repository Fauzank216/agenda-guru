import { BadRequestError } from "../../utils/errors/badRequestError.js";
import { SubjectModel } from "./subject.model.js";
export class SubjectService {
    #subjectModel
    constructor(subjectModel) {
        this.#subjectModel = subjectModel
    }
    async create({code, name}) {
        let insertId = await this.#subjectModel.create({code, name})

        if (!insertId) {
            return {
                success: true,
                message: 'Gagal Menambahkan Data',
                data: []
            }
        }

        let result = await this.#subjectModel.findById(insertId)
        return {
            success: true,
            message: 'Berhasil Menambahkan Data',
            data: result
        }
    }

    async findAll() {
        let result = await this.#subjectModel.findAll()
        return {
            success: true,
            message: 'Berhasil Mendapat Data',
            data: result
        }
    }

    async update({code, name, id_subject }) {

        let affectedRows = await this.#subjectModel.update({code, name, id_subject })

        if (affectedRows === 0) {
            return {
                success: true,
                message: 'Gagal Memperbarui Data',
                data: []
            }
        }

        let result = await this.#subjectModel.findById(id_subject)
        return {
            success: true,
            message: 'Berhasil Memperbarui Data',
            data: result
        }
    }

    async delete(id_subject) {

        let isHaveSchedule = await this.#subjectModel.findSubjectInSchedule(id_subject)

        if(isHaveSchedule.length > 0){
            throw new BadRequestError()
        }

        let affectedRows = await this.#subjectModel.delete(id_subject)

        if (affectedRows === 0) {
            return {
                success: true,
                message: 'Gagal Menghapus Data',
                data: []
            }
        }

        return {
            success: true,
            message: 'Berhasil Memperbarui Data',
            data: null
        }
    }

    async findById(id_subject) {
        let result = await this.#subjectModel.findById(id_subject)
        return {
            success: true,
            message: 'Berhasil Mendapat Data',
            data: result
        }
    }

}