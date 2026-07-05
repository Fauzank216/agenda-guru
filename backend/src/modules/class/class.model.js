export class ClassModel {
    #runQuery
    constructor(runQuery) {
        this.#runQuery = runQuery
    }

    async create({ cls, id_major, grade }) {
        const query = 'INSERT INTO t_class(name, id_major, grade) VALUES(?, ?, ?)'
        let result = await this.#runQuery(query, [cls, id_major, grade])
        return result.insertId
    }

    async update({ id_class, cls, id_major, grade }) {
        const query = 'UPDATE t_class SET name = ?, id_major = ?, grade = ? WHERE id = ?'
        let result = await this.#runQuery(query, [cls, id_major, grade, id_class])
        return result.affectedRows
    }

    async findAll(id_semester) {
        const query = `SELECT t_class.id, CONCAT(t_class.grade, ' ', t_majors.code, ' ', t_class.name) As name, t_majors.name AS major, 
                       t_majors.id As id_major, t_class.name As cls, COUNT(t_class_members.id) as total_members, t_class.grade As grade FROM t_class
                       LEFT JOIN t_class_members ON t_class_members.id_class = t_class.id AND t_class_members.id_semester = ? AND t_class_members.status = 'active'
                       LEFT JOIN t_majors ON t_majors.id = t_class.id_major
                       GROUP BY t_class.id;`
        let result = await this.#runQuery(query, [id_semester])
        return result
    }

    async delete(id_class) {
        const query = 'DELETE FROM t_class WHERE id = ?'
        let result = await this.#runQuery(query, [id_class])
        return result.affectedRows
    }

    async findById(id_class) {
        const query = `SELECT t_class.id, CONCAT(t_class.grade, ' ', t_majors.code, ' ', t_class.name) As name, t_majors.name AS major, 
                       t_majors.id As id_major, t_class.name As cls, COUNT(t_class_members.id) as total_members, t_class.grade As grade FROM t_class
                       LEFT JOIN t_class_members ON t_class_members.id_class = t_class.id
                       LEFT JOIN t_majors ON t_majors.id = t_class.id_major
                       WHERE t_class.id = ?`
        let result = await this.#runQuery(query, [id_class])
        return result
    }

    async findExistClass({id_major, grade, cls}){
         const query = `SELECT * FROM t_class WHERE t_class.id_major = ? AND t_class.grade = ? AND t_class.name = ?;`
         let result = await this.#runQuery(query, [id_major, grade, cls])
         return result
    }

    async finClassInSchedule(id_class, id_semester){
        const query = `SELECT * FROM t_schedules WHERE t_schedules.id_semester = ? AND t_schedules.id_class = ? LIMIT 1`
        let result = await this.#runQuery(query, [id_semester, id_class])
        return result
    }
}