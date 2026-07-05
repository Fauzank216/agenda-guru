import 'dotenv/config'
import express from "express";
import { authRouter } from "./modules/auth/auth.route.js";
import { errorHandlerMiddleware } from "./middlewares/errorHandler.middleware.js";
import { userRouter } from "./modules/user/user.route.js";
import { majorRouter } from "./modules/major/major.route.js";
import { classRouter } from './modules/class/class.route.js';
import { agendaRouter } from './modules/agenda/agenda.route.js';
import { scheduleRouter } from './modules/schedule/schedule.route.js';
import { agendaDetailRouter } from './modules/agenda_detail/agenda-detail.route.js';
import { studentRouter } from './modules/student/student.route.js';
import { subjectRouter } from './modules/subject/subject.route.js'
import { classMemberRouter } from './modules/class_member/class-member.route.js'
import { semesterRouter } from './modules/semester/semester.route.js';
import { reportRouter } from './modules/report/report.route.js';
import cors from 'cors'
const app = express()
const port = 3000

app.use(cors())

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

app.listen(port, () => {
    console.log(`Server running`)
})

app.use('/api/auth', authRouter)

app.use('/api/users', userRouter)

app.use('/api/majors', majorRouter)

app.use('/api/classes', classRouter)

app.use('/api/class_members', classMemberRouter)

app.use('/api/subjects', subjectRouter)

app.use('/api/schedules', scheduleRouter)

app.use('/api/semesters', semesterRouter)

app.use('/api/agendas', agendaRouter)

app.use('/api/agenda_details', agendaDetailRouter)

app.use('/api/students', studentRouter)

app.use('/api/report', reportRouter)

app.use(errorHandlerMiddleware)