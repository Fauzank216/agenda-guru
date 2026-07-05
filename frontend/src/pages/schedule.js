import { setLoading } from "../../setLoading.js";
import { api } from "../api.js";
import { showAlert, states } from "../state.js";
import { debounce } from "../../debounce.search.js";
import { createModal as createAgendaModal, updateStudentList } from "./agenda.js";
import { validateInput } from "../../validation.input.js";
let modalSchedule;
let modalAgenda
let modalDeleteConfirm;

function getCurrentDate() {
    let date = new Date()
    return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate()}`
}

let debounced = debounce((e) => {
    const input = e.target
    const type = input.getAttribute('data-type')
    const id = input.getAttribute('data-id')
    const ul = document.getElementById(`list-${id}`)

    if (!ul) return
    if (input.value != '') {
        let filteredData = states.data[`${type}`].filter(f => f.name.trim().toLowerCase().includes(input.value.trim().toLowerCase()))
        ul.style.display = 'block'
        if (filteredData.length > 0) {
            ul.innerHTML = filteredData.map(f => `<li>${f.name}</li>`).join('')
        } else {
            ul.innerHTML = `<li>Data Tidak Ditemukan</li>`
        }
        ul.onclick = (e) => {
            let value = e.target.textContent.toLowerCase()
            ul.style.display = 'none'
            if (filteredData.length > 0) {
                let result = filteredData.find(f => f.name == e.target.textContent)
                document.getElementById(`id_${id}`).value = result.id
                input.value = result.name
            }
        }
    } else {
        ul.innerHTML = ''
        ul.style.display = 'none'
        document.getElementById(`id_${id}`).value = ''
    }
}, 200)

async function handleEvent(e) {
    const btn = e.target.closest('button');
    let id = btn.getAttribute('data-id')
    if (!btn) return;

    if (e.target.title === 'Hapus') {
        document.getElementById('btn-confirm-delete').setAttribute('data-id', id)
        modalDeleteConfirm.show()
    } else if (e.target.title === 'Edit') {
        let data = states.data.schedules.find(schedule => schedule.id == id)
        showModal('Edit Jadwal', data)
    } else if (e.target.title = 'Isi Agenda') {
        let id_class = btn.getAttribute('data-id_class')
        states.id_class = id_class
        let isLoaded = states.data.members.some(member => member.id_class == id_class)
        if (!isLoaded) {
            let result = await api.get(`class_members/${id_class}`)
            if (result.ok) {
                states.data.members.push(...result.data)
            }
        }
        updateStudentList()
        document.getElementById('id_schedule').value = id
        document.getElementById('save-agenda').onclick = async () => {
            setLoading(true)
            const attendance = Array.from(document.querySelectorAll('.attendance:checked'))
            const details = attendance.map(at => {
                return { id_class_member: at.getAttribute('data-id'), status_attendance: at.value }
            })
            const note = document.getElementById('note').value
            const lesson = document.getElementById('lesson').value
            const body = {
                agendas: {
                    id_schedule: id,
                    date: getCurrentDate(),
                    lesson,
                    note,
                },
                details
            }
            let result = await api.post('agendas', body)
            if (result.ok) {
                states.data.agendas.push(result.data[0])
                showAlert(true)
            } else {
                showAlert(false)
            }
            modalAgenda.hide()
            setLoading(false)
        }
        modalAgenda.show()
    }

}

function initEvent() {
    const table = document.getElementById('table-schedule')
    const btn_triggerModal_add = document.getElementById('add-schedule')

    const btnSave = document.querySelector('#modal-schedule .btn-primary')
    const btnDelete = document.getElementById('btn-confirm-delete')

    const modal = document.getElementById('modal-schedule')

    const modalAgendaEl = document.getElementById('modal-agenda')

    const deleteModalElem = document.getElementById('modal-delete-confirm')

    const search_teacherEl = document.getElementById('teacher')
    const search_subjectEl = document.getElementById('subject')
    const search_clsEl = document.getElementById('cls_name')
    const select_timeEl = document.getElementById('category')


    if (table) table.querySelector('tbody').addEventListener('click', handleEvent)

    if (modal) modalSchedule = bootstrap.Modal.getOrCreateInstance(modal)

    if (modalAgendaEl) modalAgenda = bootstrap.Modal.getOrCreateInstance(modalAgendaEl)

    if (deleteModalElem) modalDeleteConfirm = bootstrap.Modal.getOrCreateInstance(deleteModalElem)

    if (search_clsEl) search_clsEl.addEventListener('input', debounced)

    if (search_subjectEl) search_subjectEl.addEventListener('input', debounced)

    if (search_teacherEl) search_teacherEl.addEventListener('input', debounced)

    if (btnSave) btnSave.addEventListener('click', saveSchedule)

    if (select_timeEl) {
        select_timeEl.addEventListener('change', function (e) {
            if (e.target.value == 'today') {
                let days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat']
                let today = new Date().getDay() - 1
                let todaySchedules = states.data.schedules.filter(schedule => schedule.day == days[today] )
               updateSchedule(todaySchedules)
            }else{
                updateSchedule()
            }
            console.log('test')
        })
    }

    if (btn_triggerModal_add) {
        btn_triggerModal_add.addEventListener('click', function () {
            showModal('Buat Jadwal')
        })
    }

    if (btnDelete) {
        btnDelete.addEventListener('click', async function (e) {
            let id = e.target.getAttribute('data-id')
            setLoading(true)
            let result = await api.delete(`schedules/${id}`)
            if (result.ok) {
                states.data.schedules = states.data.schedules.filter(schedule => schedule.id != id)
                showAlert(true)
            } else {
                showAlert(false)
            }
            updateSchedule()
            setLoading(false)
            modalDeleteConfirm.hide()
        })
    }
}

function showModal(title, data = {}) {
    const modalTitle = document.querySelector('#modal-schedule .modal-title');
    modalTitle.innerText = title;

    const fields = ['id_class', 'id_user', 'id_subject', 'time_start', 'time_end', 'day', 'teacher', 'subject', 'cls_name']
    fields.forEach(field => {
        const input = document.getElementById(field)
        input.value = data[field] || ''
    });

    const btnSave = document.querySelector('#modal-schedule .btn-primary');

    btnSave.dataset.currentId = data.id || ''

    modalSchedule.show()
}

async function saveSchedule() {
    const id = document.querySelector('#modal-schedule .btn-primary').getAttribute('data-current-id')
    const data = {
        id_user: document.getElementById('id_user').value,
        id_class: document.getElementById('id_class').value,
        id_subject: document.getElementById('id_subject').value,
        time_start: document.getElementById('time_start').value,
        time_end: document.getElementById('time_end').value,
        day: document.getElementById('day').value,
    };

    if (!validateInput()) return;

    if (id) {
        setLoading(true)
        let result = await api.patch(`schedules/${id}`, data)
        if (result.ok) {
            let index = states.data.schedules.findIndex(schedule => schedule.id == id)
            states.data.schedules[index] = result.data[0]
            showAlert(true)
        } else {
            showAlert(false)
        }
    } else {
        let result = await api.post(`schedules`, data)
        if (result.ok) {
            states.data.schedules.push(result.data[0])
            showAlert(true)
        } else {
            showAlert(false)
        }
    }

    updateSchedule()
    setLoading(false)
    modalSchedule.hide()
}

function createModal() {
    return `<div class="modal fade" id="modal-schedule" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">

        <div class="modal-dialog modal-dialog-centered">

            <div class="modal-content">

                <div class="modal-header">

                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                </div>

                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-6 mb-3 search-select">
                        <label for="subject" class="form-label">Kelas</label>
                         <input type="search" class="form-control" id="cls_name" data-id='class' data-type='classes' placeholder="Cari Kelas" data-rules='required'>

                         <input type="hidden" class="form-control" id="id_class" placeholder="Cari Kelas">
                         <div class="invalid-feedback">Tidak boleh kosong</div>
                          <ul class='option-list p-0 border mt-1' id='list-class'></ul>
                    </div>
                    <div class="col-6 mb-3">
                        <label for="day" class="form-label">Hari</label>
                        <select class="form-select"  id="day" aria-label="select example" data-rules='required'>
                            <option selected></option>
                            <option value="senin">Senin</option>
                            <option value="selasa">Selasa</option>
                            <option value="rabu">Rabu</option>
                            <option value="kamis">Kamis</option>
                            <option value="jumat">Jumat</option>
                        </select>
                        <div class="invalid-feedback">Tidak boleh kosong</div>
                    </div>
                </div>

                    <div class="mb-3 search-select">
                        <label for="teacher" class="form-label">Guru</label>
                         <input type="search" class="form-control" id="teacher" data-id='user' data-type='users' placeholder="Cari Guru" data-rules='required'>
                         <input type="hidden" class="form-control" id="id_user">
                         <div class="invalid-feedback">Tidak boleh kosong</div>
                         <ul class='option-list p-0 border mt-1' id='list-user'></ul>
                    </div>

                    <div class="mb-3 search-select">
                        <label for="subject" class="form-label">Mapel</label>
                         <input type="search" class="form-control" id="subject" data-id='subject' data-type='subjects' placeholder="Cari Mapel" data-rules='required'>
                         <input type="hidden" class="form-control" id="id_subject" placeholder="Cari Mapel">
                         <div class="invalid-feedback">Tidak boleh kosong</div>
                          <ul class='option-list p-0 border mt-1' id='list-subject'></ul>
                    </div>

                    <div class="row g-3">        
                    <div class="col-6 mb-3">
                        <label for="time_start" class="form-label">Jam Mulai</label>
                        <input type="time" class="form-control" id="time_start" data-rules='required'>
                        <div class="invalid-feedback">Tidak boleh kosong</div>
                    </div>

                    <div class="col-6 mb-3">
                        <label for="time_start" class="form-label">Jam Selesai</label>
                        <input type="time" class="form-control" id="time_end" data-rules='required'>
                        <div class="invalid-feedback">Tidak boleh kosong</div>
                    </div>
                </div>
                    
                </div>

                <div class="modal-footer">

                    <button type="button" class="btn btn-close-modal" data-bs-dismiss="modal">Batal</button>
                    <button type="button" class="btn btn-primary btn-save-modal">Simpan</button>

                </div>

            </div>

        </div>

    </div>`

}

function createDeleteModal() {
    return `
    <div class="modal fade" id="modal-delete-confirm" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Konfirmasi Hapus</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-close-modal" data-bs-dismiss="modal">Batal</button>
                    <button type="button" class="btn btn-danger btn-save-modal" id="btn-confirm-delete">Hapus</button>
                </div>
            </div>
        </div>
    </div>`;
}

export function renderPageSchedule(mainContent) {
    document.querySelector('.content-title').innerText = 'Data Jadwal'
    mainContent.innerHTML = `
    <div class="alert alert-primary" role="alert">
                        <span class="text-primary">
                            <i class="fa-solid fa-check-circle"></i> Process Success
                        </span>
    </div>
    <div class="alert alert-danger" role="alert">
                        <span class="text-danger">
                            <i class="fa-solid fa-exclamation-triangle"></i> Process Failed
    </span>
    </div>
    <section id="page-schedule" class="p-4">
        <header class="d-flex justify-content-between align-items-center mb-4">
            <div class="search-wrapper"></div>
            <div class="header_action">
            <select class="form-select search-select" id="category" aria-label="select example" data-rules='required'>
                <option selected>Waktu</option>
                <option value="today">Hari Ini</option>
                <option value="all">Semua</option>
            </select>
            ${states.role == 'admin' ? `<button type="button" class="btn add-teacher" id="add-schedule">
                    <i class="fa-solid fa-plus me-2"></i>Buat Jadwal
                </button>`: ''
        }   
            </div>
        </header>

        <div class="table-responsive">
            <table class="table table-custom align-middle" id="table-schedule">
                <thead class="table-light">
                    <tr>
                        <th scope="col" class="text-center">Kelas</th>
                        ${states.role == 'admin' ? ` <th scope="col" class="text-center">Guru</th>` : ''
        }
                       
                        <th scope="col" class="text-center th-optional">Hari</th>
                        <th scope="col" class="text-center th-optional">Mapel</th>
                        <th scope="col" class="text-center th-optional">Jam Mulai</th>
                        <th scope="col" class="text-center th-optional">Jam Selesai</th>
                        <th scope="col" class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>

            <nav aria-label="Navigasi halaman guru" class="d-flex justify-content-end">
                <ul class="pagination">
                    <li class="page-item disabled"><span class="page-link">Previous</span></li>
                    <li class="page-item active"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" href="#">Next</a></li>
                </ul>
            </nav>
        </div>
    </section> 
    ${states.role == 'admin' ? `
        ${createModal()}
        ${createDeleteModal()}
        `: `${createAgendaModal()}`
        }
    
    `
    updateSchedule()
    initEvent()
}

function updateSchedule(data = null) {
    const tableTeacher = document.getElementById('table-schedule')
    const tbody = tableTeacher.querySelector('tbody')
    let schedules = data ? data:states.data.schedules
    tbody.innerHTML = schedules.map(schedule =>
        ` <tr>
                        <td class="text-center">${schedule.cls_name}</td>
                        ${states.role == 'admin' ? `<td class="text-center">${schedule.teacher}</td>` : ''
        }
                        <td class="text-center">${schedule.day}</td>
                        <td class="text-center">${schedule.subject}</td>
                        <td class="text-center">${schedule.time_start}</td>
                        <td class="text-center">${schedule.time_end}</td>
                        <td class="text-center">
                            <div class="btn-group" role="group">
                                   ${states.role == 'admin' ? `
                                    <button class="admin-menu btn btn-sm btn-outline-warning" data-id="${schedule.id}" title="Edit">
                                    <i class="fa-solid fa-pen-to-square" title="Edit">
                                    </i></button>
                                    <button class="admin-menu btn btn-sm btn-outline-danger" data-id="${schedule.id}" title="Hapus">
                                    <i class="fa-solid fa-trash" title="Hapus"></i>
                                    </button>
                                     `: `
                                      <button class="admin-menu btn btn-sm btn-outline-info" data-id_class='${schedule.id_class}' data-id="${schedule.id}" title="Isi Agenda">
                                   <i class="fa-solid fa-plus"></i></button>
                                     `
        }
                                
                            </div>
                        </td>
            </tr>`
    ).join('')
}