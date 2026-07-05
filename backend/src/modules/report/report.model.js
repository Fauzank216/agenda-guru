import { runQuery } from '../../utils/tryCatch.wrapper.js'

export class ReportModel {
    //report by teacher
    // async findTeacherSummary({id_semester, id_teacher, date_start, date_end }) {
    //     const query = `SELECT t_users.id as id_teacher, t_users.name AS teacher, t_users.avatar,     
    //                        (SELECT COUNT(*) 
    //                        FROM t_schedules WHERE t_schedules.id_semester = ? AND t_schedules.id_user = t_users.id) * CEIL(DATEDIFF(?, ?) / 7) AS total_meeting, (SELECT COUNT(*)FROM t_agendas WHERE t_agendas.id_user = t_users.id  AND date BETWEEN ? AND ?) AS total_agenda FROM t_users WHERE t_users.id = ?;`
    //     let result = await runQuery(query, [id_semester, date_end, date_start, date_start, date_end, id_teacher])
    //     return result
    // }

    // async findTeacherActivity({id_semester, date_start, date_end, id_teacher }) {
    //     const query = ` SELECT t_agendas.date, CONCAT(t_class.grade, ' ', t_majors.code, ' ', t_class.  
    //                     name) As cls_name, t_subjects.name AS subject, t_agendas.note As topic FROM t_users
    //                     INNER JOIN t_agendas ON t_agendas.id_user = t_users.id
    //                     INNER JOIN t_schedules ON t_schedules.id = t_agendas.id_schedule
    //                     INNER JOIN t_subjects ON t_subjects.id = t_schedules.id_subject
    //                     INNER JOIN t_class ON t_class.id = t_schedules.id_class 
    //                     INNER JOIN t_majors ON t_majors.id = t_class.id_major
    //                     WHERE t_schedules.id_semester = ? AND t_users.id = ? AND t_agendas.date BETWEEN ? AND ?`
    //     let result = await runQuery(query, [id_semester, id_teacher, date_start, date_end])
    //     return result

    // }

    // //report by student
    // async findStudentSummary(id_class_members) {
    //     const query = `SELECT t_students.id AS id_student, t_students.name, CONCAT(t_class.grade, ' ', 
    //                    t_majors.code, ' ', t_class.name) As cls_name FROM t_class_members 
    //                    INNER JOIN t_students ON t_students.id = t_class_members.id_student 
    //                    INNER JOIN t_class ON t_class.id = t_class_members.id_class
    //                    INNER JOIN t_majors ON t_class.id_major = t_majors.id
    //                    WHERE t_class_members.id = ?`
    //     let result = await runQuery(query, [id_class_members])
    //     return result
    // }

    // async findStudentAttendance({id_semester, date_start, date_end, id_class_member}) {
    //     const query = `SELECT status_attendance FROM t_agendas
    //                    INNER JOIN t_schedules ON t_schedules.id = t_agendas.id_schedule
    //                    INNER JOIN t_agenda_details ON t_agenda_details.id_agenda = t_agendas.id 
    //                    WHERE t_schedules.id_semester = ? AND t_agenda_details.id_class_member = ? AND t_agendas.date BETWEEN ? AND ?
    //                    `
    //     let result = await runQuery(query, [id_semester, id_class_member, date_start, date_end])
    //     return result
    // }

    // async findStudentActivity({id_semester, date_start, date_end, id_class_member}) {
    //     const query = ` SELECT t_agendas.id AS id_agenda, t_agendas.date, t_users.name AS teacher,   
    //                     t_subjects.name AS subject, t_agendas.note AS topic, t_agenda_details.status_attendance, t_agenda_details.note FROM t_agendas 
    //                     INNER JOIN t_schedules ON t_schedules.id = t_agendas.id_schedule
    //                     INNER JOIN t_users ON t_users.id = t_agendas.id_user
    //                     INNER JOIN t_subjects ON t_subjects.id = t_schedules.id_subject
    //                     INNER JOIN t_agenda_details ON t_agenda_details.id_agenda = t_agendas.id
    //                     INNER JOIN t_class_members ON t_class_members.id = t_agenda_details.id_class_member
    //                     INNER JOIN t_students ON t_students.id = t_class_members.id_student
    //                     WHERE t_schedules.id_semester = ? AND  t_class_members.id = ?;`
    //     let result = await runQuery(query, [id_semester, id_class_member, date_start, date_end])
    //     return result
    // }

    // //report by class
    // async findClassSummary({id_class}) {
    //     const query = `SELECT t_class.id AS id_class, CONCAT(t_class.grade, ' ', t_majors.code, ' ', 
    //                    t_class.name) As cls_name, (SELECT COUNT(*) FROM t_class_members WHERE t_class_members.id_class = t_class.id) AS total_member FROM t_class INNER JOIN t_majors ON t_majors.id = t_class.id_major WHERE t_class.id = ?`
    //     let result = await runQuery(query, [id_class])
    //     return result
    // }

    // async findClassActivity({id_semester, date_start, date_end, id_class }) {
    //     const query = `SELECT t_agendas.id As id_agenda, date(t_agendas.date) AS date, t_users.name, 
    //                    t_subjects.name AS 
    //                    subject, t_agendas.note As topic FROM t_agendas
    //                    INNER JOIN t_schedules ON t_schedules.id = t_agendas.id_schedule
    //                    INNER JOIN t_subjects ON t_subjects.id = t_schedules.id_subject
    //                    INNER JOIN t_class ON t_schedules.id_class = t_class.id
    //                    INNER JOIN t_users ON t_users.id = t_agendas.id_user
    //                    WHERE t_schedules.id_semester = ? t_class.id = ? AND t_agendas.date BETWEEN ? AND ?;`
    //     let result = await runQuery(query, [id_semester, id_class, date_start, date_end])
    //     return result
    // }

    /*
        Jika hanya guru : total meeting adalah total meeting guru
        Jika guru dan class : total meeting adalah total pertemuan antara guru dan suatu class
        Jika hanya class : total meeting adalah total pertemuan class
    */

    async findTotalMeeting(criteria) {
        let query = `SELECT COUNT(*) * 4 as total_meeting FROM t_schedules`
        const allowedKeys = { 'id_semester': 'id_semester = ? ', 'id_user': 'id_user = ?', 'id_class': 'id_class = ?' }
        let values = []
        let conditions = []

        Object.keys(criteria).forEach(key => {
            if (key in allowedKeys) {
                conditions.push(allowedKeys[key])
                values.push(criteria[key])
            } else {
                throw new Error('Key tidak cocok')
            }
        })


        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(' AND ')
        }

        let result = await runQuery(query, values)
        return result
    }

    async findPercentace({ id_semester, id_class, id_user }) {
        let query = `
                        SELECT CONCAT(FORMAT(AVG(t_agenda_details.status_attendance = 'hadir'), 1) * 100, "%") AS persentase FROM t_agenda_details
                        INNER JOIN t_agendas ON t_agendas.id = t_agenda_details.id_agenda
                        INNER JOIN t_schedules ON t_schedules.id = t_agendas.id_schedule
                        WHERE t_schedules.id_semester = ? AND t_schedules.id_class = ? AND t_schedules.id_user = ? ;
        `
        let result = await runQuery(query, [id_semester, id_class, id_user])
        return result
    }

    async findJamKosong({ id_user, id_class }, id_semester) {
        let query = `SELECT (COUNT(t_schedules.id) * 4) - COUNT(t_agendas.id) AS jam_kosong FROM t_schedules LEFT JOIN t_agendas ON t_agendas.id_schedule = t_schedules.id WHERE t_schedules.id_semester = ? AND t_schedules.id_class = ? AND t_schedules.id_user = ?;`
        let result = await runQuery(query, [id_semester, id_class, id_user])
        return result
    }

    async findActivityRecap({ id_user, id_semester, id_class, date }) {
        let query = `SELECT DATE_FORMAT(t_agendas.date, '%Y-%m-%d') as date, CONCAT(LEFT(t_schedules.time_start, 5), ' - ',LEFT(t_schedules.time_end, 5)) AS time, t_schedules.day, t_subjects.name AS subject, t_users.name AS teacher, t_agendas.lesson, (SELECT CONCAT(FORMAT(AVG(t_agenda_details.status_attendance = 'hadir'), 1) * 100, "%") From t_agenda_details WHERE t_agenda_details.id_agenda = t_agendas.id AND t_schedules.id_semester = ?) AS persentase FROM t_agendas INNER JOIN t_schedules ON t_schedules.id = t_agendas.id_schedule INNER JOIN t_users ON t_users.id = t_schedules.id_user INNER JOIN t_subjects ON t_subjects.id = t_schedules.id_subject WHERE t_schedules.id_semester = ?`
        let values = [id_semester, id_semester]
        if (id_class) {
            query += ` AND t_schedules.id_class = ?`
            values.push(id_class)
        }

        if (id_user) {
            query += ' AND t_schedules.id_user = ?'
            values.push(id_user)
        }

        if (date && date == 'today') {
            query += ' AND t_agendas.date = CURDATE()'
            values.push(date)
        } else if (date && date == 'month') {
            query += ' AND MONTH(t_agendas.date) = MONTH(CURDATE())'
            values.push(date)
        } else if (date && date == 'week') {
            query += ' AND WEEK(t_agendas.date) = WEEK(CURDATE())'
            values.push(date)
        }
        
        let result = await runQuery(query, values)
        return result
    }
}