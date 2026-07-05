import { BadRequestError } from "../../utils/errors/badRequestError.js"
import { NotFoundError } from "../../utils/errors/notFoundError.js"
import path from 'path'
import fs from 'fs/promises'
import bcrypt from 'bcrypt'
export class UserService {
    #userModel
    constructor(userModel) {
        this.#userModel = userModel
    }

    async create({ nip, name, username, email, password, avatar }) {

        let isEmailUsed = await this.#userModel.findByEmail(email)
        let isNipUsed = await this.#userModel.findByNip(nip)

        if (isEmailUsed.length > 0 || isNipUsed.length > 0) {
            throw new BadRequestError("Email atau NIP tidak valid")
        }

        let hashedPassword = await bcrypt.hash(password, 10)

        let insertId = await this.#userModel.create({ nip, name, username, email, hashedPassword, avatar })

        let result = await this.#userModel.findById(insertId)

        return {
            success: true,
            message: "Berhasil Menambahkan Data",
            data: result
        }
    }

    async findAll(criteria) {
        let result = await this.#userModel.findAll(criteria)
        return {
            success: true,
            message: "Berhasil Mendapatkan Data",
            data: result
        }
    }

    async update({ id_user, name, username, email, nip }) {

        let existingUser = await this.#userModel.findByEmail(id_user, email)

        let isNipUsed = await this.#userModel.findByNip(id_user, nip)

        if (existingUser.length > 0 && existingUser[0].id != id_user || isNipUsed.length > 0 && isNipUsed.id_user != id_user) {
            throw new BadRequestError('Email atau NIP tidak valid')
        }

        let affectedRows = await this.#userModel.update({ id_user, name, username, email, nip })

        if (affectedRows === 0) {
            return {
                success: false,
                message: 'Gagal Memperbarui Data',
                data: null
            }
        }

        let result = await this.#userModel.findById(id_user)

        return {
            success: true,
            message: "Berhasil Memperbarui Data",
            data: result
        }

    }

    async delete(id_user) {
        let isHaveSchedule = await this.#userModel.findUserInSchedule(id_user)

        if(isHaveSchedule.length > 0){
            throw new BadRequestError()
        }

        let isHaveAgenda = await this.#userModel.findUserInAgenda(id_user)

        if(isHaveAgenda.length > 0){
            throw new BadRequestError()
        }

        let user = await this.#userModel.findById(id_user)

        if (!user) {
            throw new NotFoundError('User Tidak Ditemukan')
        }

        let affectedRows = await this.#userModel.delete(id_user)

        return {
            success: true,
            message: affectedRows > 0 ? "Berhasil Menghapus Data" : "Gagal Menghapus Data",
            data: null
        }
    }

    async updatePassword({ id_user, password }) {
        let hashedPassword = await bcrypt.hash(password, 10)

        let affectedRows = await this.#userModel.updatePassword({ id_user, hashedPassword })

        if (affectedRows === 0) {
            return {
                success: true,
                message: 'Gagal Memperbarui Data',
                data: null
            }
        }

        return {
            success: true,
            message: "Berhasil Memperbarui Data",
            data: null
        }
    }

    async updateAvatar({ id_user, avatar }) {
        const user = await this.#userModel.findById(id_user)

        if (!user) {
            let oldAvatar = path.join('uploads', avatar)
            await fs.unlink(oldAvatar)
            throw new NotFoundError('Data tidak ditemukan')
        }

        if (user.avatar) {
            try {
                let oldAvatar = path.join('uploads', user.avatar)
                await fs.unlink(oldAvatar)
            } catch (err) {
                throw err
            }
        }

        let affectedRows = await this.#userModel.updateAvatar({ id_user, avatar })

        if (affectedRows === 0) {
            return {
                success: true,
                message: 'Gagal Memperbarui Data',
                data: {
                    id_user,
                    avatar
                }
            }
        }

        let result = await this.#userModel.findById(id_user)

        return {
            success: true,
            message: "Berhasil Memperbarui Data",
            data: { id_user: result.id_user, avatar: result.avatar }
        }

    }


    async findById(userId) {
        let result = await this.#userModel.findById(userId)

        if (!result) {
            throw new BadRequestError("Data Tidak Ditemukan")
        }

        return {
            success: true,
            message: "Berhasil Mendapatkan Data",
            data: result
        }
    }

    async findByEmail(email) {
        let result = await this.#userModel.findByEmail(email)

        if (!result) {
            throw new BadRequestError("Email Tidak Valid")
        }

        return {
            success: true,
            message: "Data Berhasil ditemukan",
            data: result
        }
    }

    async findByName(name) {
        let result = await this.#userModel.findByName(name)

        if (!result) {
            throw new BadRequestError("User id Tidak Valid")
        }

        return {
            success: true,
            message: "Data Berhasil ditemukan",
            data: result
        }
    }
}