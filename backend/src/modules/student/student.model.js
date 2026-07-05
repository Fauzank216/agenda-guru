export class StudentModel {
    #runQuery
    constructor(runQuery) {
        this.#runQuery = runQuery
    }

    async create({ name, nisn, avatar }) {
        const query = "INSERT INTO t_students (nisn, name, avatar) VALUES(?, ?, ?)"
        let result = await this.#runQuery(query, [nisn, name, avatar])
        return result.insertId
    }

    async findAll(id_semester) {
        const query = `
                        SELECT t_students.id, t_class_members.id as id_member, t_students.nisn, t_students.name, t_students.avatar, t_class_members.status, CONCAT(t_class.grade, ' ', t_majors.code, ' ', t_class.name) AS cls FROM t_students 
                        LEFT JOIN t_class_members ON t_class_members.id_student = t_students.id AND t_class_members.id_semester = ? AND t_class_members.status = 'active'
                        LEFT JOIN t_class ON t_class.id = t_class_members.id_class
                        LEFT JOIN t_majors ON t_majors.id = t_class.id_major
                        ;
                      `
        let result = await this.#runQuery(query, [id_semester])
        return result
    }

    async update({ id_student, nisn, name }) {
        const query = "UPDATE t_students SET nisn = ?, name = ? WHERE id = ?"
        let result = await this.#runQuery(query, [nisn, name, id_student])
        return result.affectedRows
    }


    async delete(id_student) {
        const query = "DELETE FROM t_students WHERE id = ?"
        let result = await this.#runQuery(query, [id_student])
        return result.affectedRows
    }

    async updateAvatar({ id_student, avatar }) {
        const query = "UPDATE t_students SET avatar = ? WHERE id = ?"
        let result = await this.#runQuery(query, [avatar, id_student])
        return result.affectedRows
    }

    async findById(id_student) {
        const query = `SELECT t_students.id, t_students.nisn, t_students.name, t_students.avatar, t_class_members.status ,CONCAT(t_class.grade, ' ', t_majors.code, ' ', t_class.name) AS cls FROM t_students 
                       LEFT JOIN t_class_members ON t_class_members.id_student = t_students.id
                       LEFT JOIN t_class ON t_class.id = t_class_members.id_class
                       LEFT JOIN t_majors ON t_majors.id = t_class.id_major WHERE t_students.id = ?`
        let result = await this.#runQuery(query, [id_student])
        return result
    }

    async findByNis(nisn){
        const query = `SELECT id FROM t_students WHERE nisn = ?`
        let result = await this.#runQuery(query, [nisn])
        return result
    }

     async findStudentInClass(id_student){
         const query = `SELECT * FROM t_class_members WHERE t_class_members.id_student = ? AND t_class_members.status = 'active' LIMIT 1`
         let result = await this.#runQuery(query, [id_student])
         return result
     }

    
}
