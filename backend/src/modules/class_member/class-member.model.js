export class ClassMemberModel {
    #runQuery
    constructor(runQuery) {
        this.#runQuery = runQuery
    }

    async create({id_class, id_student, id_semester}) {
        const query = 'INSERT INTO t_class_members (id_class, id_student, id_semester) VALUES(?, ?, ?)'
        let result = await this.#runQuery(query, [id_class, id_student, id_semester])
        return result.insertId
    }

    async findAll({id_semester, id_class}) {
        const query = `
                        SELECT t_class_members.id_student, t_class.id AS id_class, t_class_members.id AS id_member, CONCAT(t_class.grade, ' ', t_majors.code, ' ', t_class.name) AS cls, t_students.nisn, t_class_members.status, t_students.name, (SELECT CONCAT(FORMAT(AVG(t_agenda_details.status_attendance = 'hadir'), 1) * 100, "%") From t_agenda_details 
                        WHERE t_agenda_details.id_class_member = t_class_members.id
                        GROUP BY t_agenda_details.id_class_member) AS persentase,
                        t_students.avatar FROM t_class_members 
                        INNER JOIN t_students ON t_students.id = t_class_members.id_student 
                        INNER JOIN t_class ON t_class.id = t_class_members.id_class
                        INNER JOIN t_semesters ON t_semesters.id = t_class_members.id_semester
                        INNER JOIN t_majors ON t_majors.id = t_class.id_major
                        WHERE t_semesters.id = ? AND t_class_members.id_class = ? AND t_class_members.status = 'active';
                      `
        let result = await this.#runQuery(query, [id_semester, id_class])
        return result
    }

    async update({ status, id_class_member }) {
        const query = 'UPDATE t_class_members SET status = ? WHERE id = ?'
        let result = await this.#runQuery(query, [status, id_class_member])
        return result.affectedRows
    }

    async delete(id_class_member) {
        const query = 'DELETE FROM t_class_members WHERE id = ?'
        let result = await this.#runQuery(query, [id_class_member])
        return result.affectedRows
    }

    async findById(id_class_member) {
        const query = `
                        SELECT t_class_members.id_student, t_class.id AS id_class, t_class_members.id AS id_member, CONCAT(t_class.grade, ' ', t_majors.code, ' ', t_class.name) AS cls, t_students.nisn, t_class_members.status, t_students.name, 
                        (SELECT CONCAT(FORMAT(AVG(t_agenda_details.status_attendance = 'hadir'), 1) * 100, "%") From t_agenda_details 
                        WHERE t_agenda_details.id_class_member = t_class_members.id
                        GROUP BY t_agenda_details.id_class_member) AS persentase,
                        t_students.avatar FROM t_class_members 
                        INNER JOIN t_students ON t_students.id = t_class_members.id_student 
                        INNER JOIN t_class ON t_class.id = t_class_members.id_class
                        INNER JOIN t_majors ON t_majors.id = t_class.id_major
                        WHERE t_class_members.id = ?;
                      `
        let result = await this.#runQuery(query, [id_class_member])
        return result
    }

    async findExistMember(id_student, id_class){
         const query = `SELECT * FROM t_class_members WHERE t_class_members.id_student = ? AND t_class_members.id_class = ?;`
         let result = await this.#runQuery(query, [id_student, id_class])
         return result
    }

}