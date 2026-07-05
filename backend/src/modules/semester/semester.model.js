export class SemesterModel {
    #runQuery
    constructor(runQuery) {
        this.#runQuery = runQuery
    }

    async create({ academic_year, date_start, date_end, semester_type }) {
        const query = 'INSERT INTO t_semesters(academic_year, date_start, date_end,semester_type) VALUES(?, ?, ?, ?)'
        let result = await this.#runQuery(query, [academic_year, date_start, date_end, semester_type])
        return result.insertId
    }

    async update({ academic_year, date_start, date_end, semester_type, is_active = '', id_semester }) {
        const query = 'UPDATE t_semesters SET academic_year = ?, date_start = ?, date_end = ?, semester_type = ?, is_active = ? WHERE id = ?'
        let result = await this.#runQuery(query, [academic_year, date_start, date_end, semester_type, is_active, id_semester])
        return result.affectedRows
    }

    async findAll() {
        const query = 'SELECT id, academic_year, DATE_FORMAT(date_start, "%Y-%m-%d") as date_start, DATE_FORMAT(date_end, "%Y-%m-%d") as date_end, semester_type, is_active FROM t_semesters'
        let result = await this.#runQuery(query, [])
        return result
    }

    async delete(id_semester) {
        const query = 'DELETE FROM t_semesters WHERE id = ?'
        let result = await this.#runQuery(query, [id_semester])
        return result.affectedRows
    }

    async findById(id_semester) {
        const query = 'SELECT id, academic_year, DATE_FORMAT(date_start, "%Y-%m-%d") as date_start, DATE_FORMAT(date_end, "%Y-%m-%d") as date_end, semester_type, is_active FROM t_semesters WHERE id = ?'
        let result = await this.#runQuery(query, [id_semester])
        return result
    }

    async findActive(){
        const query = `SELECT id FROM t_semesters WHERE is_active = true`
        let result = await this.#runQuery(query, [])
        return result
    }

    async findSemesterInSchedule(id_semester){
        const query = `SELECT * FROM t_schedules WHERE id_semester = ?`
        let result = await this.#runQuery(query, [id_semester])
        return result
    }
}