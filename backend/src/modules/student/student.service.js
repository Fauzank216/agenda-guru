import path from 'path'
import { NotFoundError } from '../../utils/errors/notFoundError.js'
import { BadRequestError } from '../../utils/errors/badRequestError.js'
import fs from 'fs/promises'
export class StudentService {
    #studentModel
    #semesterModel
    constructor(studentModel, semesterModel) {
        this.#studentModel = studentModel
        this.#semesterModel = semesterModel
    }

    async create({ nisn, name, avatar = null }) {

        let isNisUsed = await this.#studentModel.findByNis(nisn)

        if (isNisUsed.length > 0) {
            throw new BadRequestError("NISN tidak valid")
        }

        let insertId = await this.#studentModel.create({ nisn, name, avatar })

        if (!insertId) {
            return {
                success: true,
                message: 'Gagal menambahkan Data',
                data: []
            }
        }

        let result = await this.#studentModel.findById(insertId)
        return {
            success: true,
            message: 'Berhasil Menambahkan Data',
            data: result
        }
    }

    async findAll() {
        let semester = await this.#semesterModel.findActive()

        let result = await this.#studentModel.findAll(semester[0].id)
        return {
            success: true,
            message: 'Berhasil Mendapatkan Data',
            data: result
        }
    }

    async update({ nisn, name, id_student }) {

        let student = await this.#studentModel.findById(id_student)

        if (!student) {
            throw new NotFoundError('Data Tidak Ditemukan')
        }

        let isNisUsed = await this.#studentModel.findByNis(nisn)
        console.log(isNisUsed)
        if (isNisUsed.length > 0 && isNisUsed[0].id != id_student) {
            throw new BadRequestError("NISN tidak valid")
        }

        let affectedRows = await this.#studentModel.update({ nisn, name, id_student })

        let result = await this.#studentModel.findById(id_student)

        return {
            success: true,
            message: affectedRows > 0 ? 'Berhasil Memperbarui data' : 'Gagal Memperbarui Data',
            data: result
        }
    }

    async delete(id_student) {

        let isHaveClass = await this.#studentModel.findStudentInClass(id_student)
        console.log(isHaveClass)
        
        if(isHaveClass.length > 0){
            throw new BadRequestError()
        }


        let affectedRows = await this.#studentModel.delete(id_student)

        return {
            success: true,
            message: affectedRows > 0 ? 'Berhasil Menghapus Data' : 'Gagal Menghapus Data',
            data: null
        }
    }


    async updateAvatar({ avatar, id_student }) {
        let student = await this.#studentModel.findById(id_student)

        if (!student) {
            let oldAvatar = path.join('uploads', avatar)
            await fs.unlink(oldAvatar)
            throw new NotFoundError('Data Tidak Ditemukan')
        }

        if (student.avatar) {
            let oldAvatar = path.join('uploads', student.avatar)
            await fs.unlink(oldAvatar)
        }

        let affectedRows = await this.#studentModel.updateAvatar({ avatar, id_student })

        let result = await this.#studentModel.findById(id_student)
        return {
            success: true,
            message: affectedRows > 0 ? 'Berhasil Memperbarui Data' : 'Gagal Memperbarui Data',
            data: { id: result.id, avatar: result.avatar }
        }
    }

    async findById(id_student) {
        let result = await this.#studentModel.findById(id_student)

        if (!result) {
            throw new NotFoundError('Data Tidak Ditemukan')
        }

        return {
            success: true,
            message: 'Berhasil Mendapatkan Data',
            data: result
        }
    }
}