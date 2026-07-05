export class ClassMemberService {
    #classMemberModel
    #semesterModel
    constructor(classMemberModel, semesterModel) {
        this.#classMemberModel = classMemberModel
        this.#semesterModel = semesterModel
    }

    async create(students) {
        let semester = await this.#semesterModel.findActive()
        let results = []

        for (const student of students) {
            let existingStudent = await this.#classMemberModel.findExistMember(student.id_student, student.id_class)
            console.log(existingStudent)
            if (existingStudent.length > 0) {
                await this.#classMemberModel.update({ status: 'active', id_class_member: existingStudent[0].id})
                let result = await this.#classMemberModel.findById(existingStudent[0].id)
                results.push(result[0])
            } else {
                let insertId = await this.#classMemberModel.create({ id_class: student.id_class, id_student: student.id_student, id_semester: semester[0].id })
                let result = await this.#classMemberModel.findById(insertId)
                results.push(result[0])
            }
        }

        if (results.length === 0) {
            return {
                success: false,
                message: 'Gagal Menambahkan Data',
                data: []
            }
        }

        console.log(results)

        return {
            success: true,
            message: 'Berhasil Menambahkan Data',
            data: results
        }
    }

    async findAll({ id_class }) {
        let semester = await this.#semesterModel.findActive()
        let result = await this.#classMemberModel.findAll({ id_semester: semester[0].id, id_class })
        return {
            success: true,
            message: 'Berhasil Mendapat Data',
            data: result
        }
    }

    async update({ status, id_class_member }) {
        let affectedRows = await this.#classMemberModel.update({ status, id_class_member })
        if (affectedRows === 0) {
            return {
                success: true,
                message: 'Gagal Memperbarui Data',
                data: []
            }
        }

        let result = await this.#classMemberModel.findById(id_class_member)
        return {
            success: true,
            message: 'Berhasil Memperbarui Data',
            data: result
        }
    }

    async delete(id_class_member) {
        let affectedRows = await this.#classMemberModel.delete(id_class_member)
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

    async findById({ id_class }) {
        let result = await this.#classMemberModel.findById(id_class)
        return {
            success: true,
            message: 'Berhasil Mendapat Data',
            data: result
        }
    }
}