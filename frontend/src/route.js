import {renderPageUser } from './pages/teacher.js'
import { renderPageStudent } from './pages/student.js'
import { renderPageSemester } from './pages/semester.js'
import { renderPageMajor } from './pages/major.js'
import { renderPageSubject } from './pages/subject.js'
import { renderPageClass } from './pages/class.js'
import { renderPageSchedule } from './pages/schedule.js'
import { states } from './state.js'
import { renderPagesAgenda } from './pages/agenda.js'
import { renderPageReport } from './pages/report.js'
function renderPageDashboard() {
     document.querySelector('.content-title').innerText = 'Dashboard'
    document.getElementById('app').innerHTML = `<section id="page-dashboard">
        <nav class="dashboard-stats">
            <div>
                <p>Total Guru <br> <span class="fs-1">${states.data.users.length}</span></p>
            </div>
            <div>
                <p>Total Murid <br> <span class="fs-1">${states.data.students.length}</span></p>
            </div>
            <div>
                <p>Total Jurusan <br> <span class="fs-1">${states.data.majors.length}</span></p>
            </div>
            <div>
                <p>Tahun ajar<br> <span class="fs-1">2025/2026</span></p>
            </div>
        </nav>
    </section>`
}

export const pages = {
    "guru": renderPageUser,
    "siswa": renderPageStudent,
    "mapel": renderPageSubject,
    "kelas": renderPageClass,
    "semester": renderPageSemester,
    "jurusan": renderPageMajor,
    "jadwal":renderPageSchedule,
    "agenda":renderPagesAgenda,
    "laporan":renderPageReport,
    "dashboard": renderPageDashboard
}

