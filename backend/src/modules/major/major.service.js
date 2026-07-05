import { BadRequestError } from "../../utils/errors/badRequestError.js"
import { MajorModel } from "./major.model.js"
export class MajorService {
    static create = async function ({ major_code, major_name }) {

        let isMajorExist = await MajorModel.findExistMajor(major_code, major_name)

        if(isMajorExist.length > 0){
            throw new BadRequestError()
        }

        let insertId = await MajorModel.create({ major_code, major_name })
        if (!insertId) {
            return {
                success: true,
                message: "Gagal Menambahkan Data",
                data: []
            }
        }

        let result = await MajorModel.findById(insertId)
        return {
            success: true,
            message: "Berhasil Menambahkan Data",
            data: result
        }
    }

    static update = async function ({ id_major, major_code, major_name }) {

        let isMajorExist = await MajorModel.findExistMajor(major_code, major_name)

        if(isMajorExist.length > 0 && isMajorExist[0].id != id_major){
            throw new BadRequestError()
        }

        let affectedRows = await MajorModel.update({ major_code, major_name, id_major })

        if (affectedRows === 0) {
            return {
                success: true,
                message: "Gagal Memperbarui Data",
                data: []
            }
        }

        let result = await MajorModel.findById(id_major)
        return {
            success: true,
            message: "Berhasil Memperbarui Data",
            data: result
        }
    }

    static delete = async function (id_major) {
        let isHaveClass = await MajorModel.findInCLass(id_major)

        if(isHaveClass.length > 0){
            throw new BadRequestError()
        }

        let affectedRows = await MajorModel.delete(id_major)

        if (affectedRows === 0) {
            return {
                success: true,
                message: "Gagal Memperbarui Data",
                data: []
            }
        }

        return {
            success: true,
            message: "Berhasil Menghapus Jurusan",
            data: null
        }
    }

    static findAll = async function () {
        let result = await MajorModel.findAll()
        return {
            succes: true,
            message: "Berhasil Mendapatkan Data",
            data: result
        }
    }

    static findById = async function (id_major) {
        let result = await MajorModel.findById(id_major)
        return {
            succes: true,
            message: "Berhasil Mendapatkan Data",
            data: result
        }
    }
}