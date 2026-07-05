import { runQuery } from '../../utils/tryCatch.wrapper.js'

export class AgendaDetailModel {
    #runQuery
    constructor(runQuery) {
        this.#runQuery = runQuery
    }

    async create(conn, dataDetail) {
        const query = 'INSERT INTO t_agenda_details (id_agenda, id_class_member, status_attendance, note) VALUES ? '
        let [result] = await conn.query(query, [dataDetail])
        return result.insertId
    }

    async findAll(id_agenda) {
        const query = `SELECT t_agendas.id as id_agenda, t_students.nisn as nis, t_agenda_details.id as id_detail, t_class_members.id_student as id_student, t_students.name, t_agenda_details.       
                       status_attendance, t_agenda_details.note FROM t_agenda_details 
                       INNER JOIN t_class_members ON t_class_members.id = t_agenda_details.id_class_member
                       INNER JOIN t_students ON t_students.id = t_class_members.id_student
                       INNER JOIN t_agendas ON t_agendas.id = t_agenda_details.id_agenda
                       WHERE t_agendas.id = ?`
        let result = await this.#runQuery(query, [id_agenda])
        return result
    }

    async update({ id, status_attendance, note }) {
        const query = 'UPDATE t_agenda_details SET status_attendance = ?, note = ? WHERE id = ?'
        let result = await this.#runQuery(query, [status_attendance, note, id])
        return result.affectedRows
    }


    async delete(id_agenda_details) {
        const query = 'DELETE FROM t_agenda_details WHERE id = ?'
        let result = await runQuery(query, [id_agenda_details])
        return result.affectedRows
    }

    async findById(id_agenda_details) {
        const query = `SELECT t_agendas.id as id_agenda, t_agenda_details.id AS id_detail, t_students.nisn as nis, t_students.id as id_student,    
                       t_students.name, t_agenda_details.status_attendance, t_agenda_details.note FROM t_agenda_details 
                       INNER JOIN t_class_members ON t_class_members.id = t_agenda_details.id_class_member
                       INNER JOIN t_students ON t_students.id = t_class_members.id_student
                       INNER JOIN t_agendas ON t_agendas.id = t_agenda_details.id_agenda 
                       WHERE t_agenda_details.id = ?;`
        let result = await runQuery(query, [id_agenda_details])
        return result
    }

   
}