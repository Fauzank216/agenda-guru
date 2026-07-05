export class ScheduleModel {
    #runQuery
    constructor(runQuery) {
        this.#runQuery = runQuery
    }
    async create({ id_user, id_class, id_subject, id_semester, day, time_start, time_end }) {
        const query = `INSERT INTO t_schedules 
                       (id_user, id_class, id_subject, id_semester, day, time_start, time_end)
                       VALUES(?, ?, ?, ?, ?, ?, ?)
                      `
        let result = await this.#runQuery(query, [id_user, id_class, id_subject, id_semester, day, time_start, time_end])

        return result.insertId
    }

    async findAll({ id_semester, id_user = null }) {
        let query = `SELECT t_schedules.id, t_schedules.id_user, t_class.id as id_class, t_schedules.id_subject, t_schedules.day, CONCAT(t_class.grade, ' ', t_majors.code, ' ', t_class.name) As cls_name, t_users.name as 
                       teacher, t_subjects.name as subject, t_schedules.time_start, t_schedules.
                       time_end 
                       FROM t_schedules
                       INNER JOIN t_users ON t_users.id = t_schedules.id_user
                       INNER JOIN t_class ON t_class.id = t_schedules.id_class
                       INNER JOIN t_majors ON t_majors.id = t_class.id_major
                       INNER JOIN t_subjects ON t_subjects.id = t_schedules.id_subject
                       WHERE t_schedules.id_semester = ?
                       `
        if (id_user) query += ' AND t_users.id = ? '

        let result = await this.#runQuery(query, [id_semester, id_user])
        return result
    }

    async update({ id_user, id_class, id_subject, id_semester, day, time_start, time_end, id_schedule }) {
        const query = 'UPDATE t_schedules SET id_user = ?, id_class = ?, id_subject = ?, id_semester = ?, day = ?, time_start = ?, time_end = ? WHERE id = ?'
        let result = await this.#runQuery(query, [id_user, id_class, id_subject, id_semester, day, time_start, time_end, id_schedule])
        return result.affectedRows
    }

    async delete(id_schedule) {
        const query = 'DELETE FROM t_schedules WHERE id = ? '
        let result = await this.#runQuery(query, [id_schedule])
        return result.affectedRows
    }

    async findById(id_schedule) {
        const query = `SELECT t_schedules.id, t_schedules.id_user, t_schedules.id_class AS id_class, t_schedules.id_subject, t_schedules.day, CONCAT(t_class.grade, ' ', t_majors.code, ' ', t_class.name) As cls_name, t_users.name as 
                       teacher, t_subjects.name as subject, t_schedules.time_start, t_schedules.
                       time_end 
                       FROM t_schedules
                       INNER JOIN t_users ON t_users.id = t_schedules.id_user
                       INNER JOIN t_class ON t_class.id = t_schedules.id_class
                        INNER JOIN t_majors ON t_majors.id = t_class.id_major
                       INNER JOIN t_subjects ON t_subjects.id = t_schedules.id_subject WHERE t_schedules.id = ?`
        let result = await this.#runQuery(query, [id_schedule])
        return result
    }

    async findExistSchedule({ id_semester, id_class, id_user, day, time_start, time_end }) {
        const query = `SELECT id FROM t_schedules WHERE id_semester = ? AND (id_class = ? OR id_user = ?) 
                       AND day = ? AND ? < time_end AND ? > time_start;`
        let result = await this.#runQuery(query, [id_semester, id_class, id_user, day, time_start, time_end])
        return result
    }

    async findExistSchedules({ id_semester, id_class, id_user, day, time_start, time_end }) {
        console.log({ id_user, id_class, id_semester, day, time_start, time_end})
        const query = `SELECT id FROM t_schedules 
WHERE id_semester = ? AND (id_class = ? AND id_user != ?) 
AND day = ? AND ? < time_end AND ? > time_start;`
        let result = await this.#runQuery(query, [id_semester, id_class, id_user, day, time_start, time_end])
        return result
    }

}

/*
 07:00 - 09:00 
 Jam mulai harus lebih besar dari jam selesai,
 Jam selesai harus lebih besar dari jam mulai 
*/ 