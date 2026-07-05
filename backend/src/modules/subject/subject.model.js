export class SubjectModel {
    #runQuery
    constructor(runQuery) {
        this.#runQuery = runQuery
    }
    async create({code, name}) {
        const query = 'INSERT INTO t_subjects (code, name) VALUES(?, ?)'
        let result = await this.#runQuery(query, [code, name])
        return result.insertId
    }

    async findAll() {
        const query = 'SELECT * FROM t_subjects'
        let result = await this.#runQuery(query, [])
        return result
    }

    async update({ code, name, id_subject }) {
        const query = 'UPDATE t_subjects SET code = ?, name = ? WHERE id = ?'
        let result = await this.#runQuery(query, [code, name, id_subject])
        return result.affectedRows
    }

    async delete(id_subject) {
        const query = 'DELETE FROM t_subjects WHERE id = ?'
        let result = await this.#runQuery(query, [id_subject])
        return result.affectedRows
    }

    async findById(id_subject) {
        const query = 'SELECT * FROM t_subjects WHERE id = ?'
        let result = await this.#runQuery(query, [id_subject])
        return result
    }

    async findSubjectInSchedule(id_subject){
        const query = `SELECT * FROM t_schedules WHERE t_schedules.id_subject = ?`
        let result = await this.#runQuery(query, [id_subject])
        return result
    }
}