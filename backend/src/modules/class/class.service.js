import { BadRequestError } from "../../utils/errors/badRequestError.js"

export class ClassService {
    #classModel
    #semesterModel
    constructor(classModel, semesterModel) {
        this.#classModel = classModel
        this.#semesterModel = semesterModel
    }
    async create({ cls, id_major, grade }) {

        let isExist = await this.#classModel.findExistClass({ id_major, grade, cls })

        if (isExist.length > 0) {
            throw new BadRequestError()
        }

        let insertId = await this.#classModel.create({ cls, id_major, grade })
        if (!insertId) {
            return {
                success: true,
                message: 'Gagal Menambahkan Data',
                data: []
            }
        }

        let result = await this.#classModel.findById(insertId)

        return {
            success: true,
            message: "Berhasil Menambahkan Data",
            data: result
        }
    }

    async findAll() {
        let semester = await this.#semesterModel.findActive()

        if (semester.length == 0) {
            throw new BadRequestError("Terjadi Kesalahan")
        }

        let result = await this.#classModel.findAll(semester[0].id)

        return {
            success: true,
            message: "Berhasil Mendapat Data",
            data: result
        }
    }

    async update({ id_class, cls, id_major, grade }) {

        let isExist = await this.#classModel.findExistClass({ id_major, grade, cls })

        if (isExist.length > 0 && isExist[0].id_class != id_class) {
           throw new BadRequestError()
        }

        let affectedRow = await this.#classModel.update({ id_class, cls, id_major, grade })

        if (affectedRow === 0) {
            return {
                success: true,
                message: "Gagal Memperbarui Data",
                data: []
            }
        }

        let result = await this.#classModel.findById(id_class)
        return {
            success: true,
            message: "Berhasil Memperbarui Data",
            data: result
        }
    }

    async delete(id_class) {
        let semester = await this.#semesterModel.findActive()
        let isHaveRelation = await this.#classModel.finClassInSchedule(id_class, semester[0].id)

        if(isHaveRelation.length > 0){
            throw new BadRequestError()
        }

        let affectedRow = await this.#classModel.delete(id_class)

        if (affectedRow === 0) {
            return {
                success: true,
                message: "Gagal Menghapus Data",
                data: []
            }
        }

        return {
            success: true,
            message: "Berhasil Menghapus Data",
            data: null
        }
    }

    async findById(id_class) {
        let result = await this.#classModel.findById(id_class)

        return {
            success: true,
            message: 'Berhasil Mendapat Data',
            data: result
        }
    }

}