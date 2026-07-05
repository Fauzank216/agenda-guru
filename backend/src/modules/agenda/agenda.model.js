export class AgendaModel {
    #runQuery
    constructor(runQuery) {
        this.#runQuery = runQuery
    }

    async create(conn, dataAgenda) {
        const query = 'INSERT INTO t_agendas (id_user, id_schedule, date, lesson, note) VALUES (?, ?, ?, ?, ?)'
        let [result] = await conn.query(query, [dataAgenda.id_user, dataAgenda.id_schedule, dataAgenda.date, dataAgenda.lesson, dataAgenda.note])
        return result.insertId
    }

    async findAll({ id_semester, id_user = null }) {
        let query = `SELECT t_agendas.id as id_agenda, t_users.name as teacher, DATE_FORMAT(t_agendas.date, '%Y-%m-%d') as date, CONCAT
                     (t_class.grade, ' ', t_majors.code, ' ', t_class.name) As cls , t_subjects.name AS subject, t_agendas.lesson, t_agendas.note FROM t_agendas INNER JOIN t_schedules ON t_schedules.id = t_agendas.id_schedule
                     INNER JOIN t_class ON t_class.id = t_schedules.id_class
                     INNER JOIN t_majors ON t_majors.id = t_class.id_major
                     INNER JOIN t_users ON t_users.id = t_agendas.id_user
                     INNER JOIN t_subjects ON t_subjects.id = t_schedules.id_subject
                     WHERE t_schedules.id_semester = ?`
        let values = [id_semester]
        if (id_user) {
            query += ' AND t_users.id = ? '
            values.push(id_user)
            console.log(query)
            console.log(id_user)
        }
        let result = await this.#runQuery(query, values)
        return result
    }

    async update({ id_agenda, lesson, note }) {
        const query = 'UPDATE t_agendas SET lesson = ?, note = ? WHERE id = ?'
        let result = await this.#runQuery(query, [lesson, note, id_agenda])
        return result.affectedRows
    }

    async delete(id_agenda) {
        const query = 'DELETE FROM t_agendas WHERE id = ?'
        let result = await this.#runQuery(query, [id_agenda])
        return result.affectedRows
    }

    async findById(id_agenda) {
        const query = `
                        SELECT t_agendas.id as id_agenda, t_users.name as teacher, DATE_FORMAT(t_agendas.date, '%Y-%m-%d') as date, CONCAT(t_class.grade, ' ', t_majors.code, ' ', t_class.name) As cls , t_subjects.name AS subject, t_agendas.lesson, t_agendas.note FROM t_agendas INNER JOIN t_schedules ON t_schedules.id = t_agendas.id_schedule
                        INNER JOIN t_class ON t_class.id = t_schedules.id_class
                        INNER JOIN t_majors ON t_majors.id = t_class.id_major
                        INNER JOIN t_users ON t_users.id = t_agendas.id_user
                        INNER JOIN t_subjects ON t_subjects.id = t_schedules.id_subject
                        WHERE t_agendas.id = ?
                        `
        let result = this.#runQuery(query, [id_agenda])
        return result
    }

     async findExistAgenda(id_schedule, date){{
         const query = `SELECT * FROM t_agendas WHERE t_agendas.id_schedule = ? AND t_agendas.date = ?`
         let result = await this.#runQuery(query, [id_schedule, date])
         return result
    }}

     async finAgendaInDetail(id_agenda){
        const query = `SELECT * FROM t_agenda_details WHERE t_agenda_details.id_agenda = ? LIMIT 1`
        let result = await this.#runQuery(query, [id_agenda])
        return result
    }
}