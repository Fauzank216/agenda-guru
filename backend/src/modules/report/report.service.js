export class ReportService {
    #reportModel
    #semesterModel
    constructor(reportModel, semesterModel) {
        this.#reportModel = reportModel
        this.#semesterModel = semesterModel
    }

    async findRecap(criteria){
        let semester = await this.#semesterModel.findActive()
        let {id_user, id_class, date} = criteria
        let id_semester = semester[0].id

        let total_meeting = await this.#reportModel.findTotalMeeting({id_user, id_class, id_semester})
        let persentase = await this.#reportModel.findPercentace({id_semester, id_user, id_class})
        let jam_kosong = await this.#reportModel.findJamKosong(criteria, semester[0].id)
        let activity = await this.#reportModel.findActivityRecap({id_user, id_class, date, id_semester})
        let result = [{...total_meeting[0], ...persentase[0], ...jam_kosong[0], activity:[...activity]}]
        return {
            status:200,
            message:'success',
            data:result
        }
    }

    async findStudentReport({ date_start, date_end, id_class_member }) {
        let attendance = { hadir: 0, izin: 0, alpha: 0, sakit: 0 }

        const semester = await this.#semesterModel.findActive()
        let id_semester = semester.length > 0 ? semester[0].id_semester : ''

        const header = await this.#reportModel.findStudentSummary(id_class_member)

        const attendanceRows = await this.#reportModel.findStudentAttendance({ id_semester, date_start, date_end, id_class_member })

        attendanceRows.forEach(row => {
            attendance[row.status_attendance]++
        });

        const body = await this.#reportModel.findStudentActivity({ id_semester, date_start, date_end, id_class_member })
        let result = {
            summary: { ...header[0], ...attendance },
            activities: [...body]
        }

        return {
            status: 200,
            message: 'Berhasil Mendapatkan Data',
            data: result
        }

    }

    async findClassReport({date_start, date_end, id_class }) {
        const semester = await this.#semesterModel.findActive()
        let id_semester = semester.length > 0 ? semester[0].id_semester : ''
        const header = await this.#reportModel.findClassSummary({ id_class })
        const body = await this.#reportModel.findClassActivity({ id_semester, date_start, date_end, id_class })
        let result = {
            summary: { ...header[0], range: `${date_start} - ${date_end}` },
            activities: [...body]
        }
        return {
            status: 200,
            message: 'Berhasil Mendapatkan Data',
            data: result
        }
    }


}