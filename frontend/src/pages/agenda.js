import { setLoading } from "../../setLoading.js";
import { api } from "../api.js";
import { showAlert, states } from "../state.js"
import { renderPagesAgendaDetail } from "./agenda-detail.js";
import { validateInput } from "../../validation.input.js";

let modalAgenda;
let modalDeleteConfirm;

function getCurrentDate() {
    let date = new Date()
    return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate()}`
}

async function handleEvent(e) {
    const btn = e.target.closest('button');
    let id = btn.getAttribute('data-id')
    if (!btn) return;

    if (e.target.title === 'Hapus') {
        modalDeleteConfirm.show()
        document.getElementById('btn-confirm-delete').setAttribute('data-id', id)
        modalDeleteConfirm.show()
    } else if (e.target.title === 'Edit') {
        document.querySelector('.attendance_section').style.display = 'none'
        let data = states.data.agendas.find(agenda => agenda.id_agenda == id)
        showModal('Edit Agenda', data)
    } else if (e.target.title === 'Detail') {
        setLoading(true)
        console.log(states.data)
        states.id_agenda = id
        let isLoaded = states.data.agenda_detail.some(d => d.id_agenda == id)
        if (!isLoaded) {
            let result = await api.get(`agenda_details/${id}`)
            if (result.ok) {
                states.data.agenda_detail.push(...result.data)
                const app = document.getElementById('app')
            }
        }
        renderPagesAgendaDetail(app)
        setLoading(false)
    }

}

function initEvent() {
    const table = document.getElementById('table-agenda')
    const btn_triggerModal_add = document.getElementById('add-agenda')
    const btn = document.querySelector('#modal-agenda .btn-primary')
    const modal = document.getElementById('modal-agenda')
    const deleteModalElem = document.getElementById('modal-delete-confirm')
    const btn_confirm_delete = document.getElementById('btn-confirm-delete')
    const select_timeEl = document.getElementById('category')

    if (table) table.querySelector('tbody').addEventListener('click', handleEvent)

    if (btn_triggerModal_add) {
        btn_triggerModal_add.addEventListener('click', function () {
            document.querySelector('.attendance_section').style.display = 'block'
            showModal('Tambah Agenda')
        })
    }

    if (btn) btn.addEventListener('click', saveAgenda)

    if (modal) modalAgenda = bootstrap.Modal.getOrCreateInstance(modal)

    if (deleteModalElem) modalDeleteConfirm = bootstrap.Modal.getOrCreateInstance(deleteModalElem)


    if (select_timeEl) {
        select_timeEl.addEventListener('change', function (e) {
            if (e.target.value == 'today') {
                let nowDate = getCurrentDate()
                let todayAgenda = states.data.agendas.filter(agenda => agenda.date == nowDate )
                updateAgenda(todayAgenda)
                console.log(todayAgenda)
            } else {
                updateAgenda()
            }
            console.log('test')
        })
    }

    if (btn_confirm_delete) {
        btn_confirm_delete.addEventListener('click', async function (e) {
            setLoading(true)
            let id = e.target.getAttribute('data-id')
            let result = await api.delete(`agendas/${id}`)
            if (result.ok) {
                states.data.agendas = states.data.agendas.filter(agenda => agenda.id_agenda != id)
                showAlert(true)
            } else {
                showAlert(false)
            }
            updateAgenda()
            modalDeleteConfirm.hide()
            setLoading(false)
        })
    }

}

function showModal(title, data = {}) {
    const modalTitle = document.querySelector('#modal-agenda .modal-title');
    modalTitle.innerText = title;

    const fields = ['lesson', 'note']
    fields.forEach(field => {
        const input = document.getElementById(field)
        input.value = data[field] || ''
    });

    const btnSave = document.querySelector('#modal-agenda .btn-primary');

    btnSave.dataset.currentId = data.id_agenda || ''

    modalAgenda.show()
}

async function saveAgenda() {
    const id = document.querySelector('#modal-agenda .btn-primary').getAttribute('data-current-id')
    const data = {
        lesson: document.getElementById('lesson').value,
        note: document.getElementById('note').value,
    };

    if (!validateInput()) return;

    setLoading(true)
    if (id) {
        let result = await api.patch(`agendas/${id}`, data)
        if (result.ok) {
            let index = states.data.agendas.findIndex(agenda => agenda.id_agenda == id)
            states.data.agendas[index] = result.data[0]
            showAlert(true)
        } else {
            showAlert(false)
        }
    } else {
        states.data.agendas.push(result.data[0])
    }

    updateAgenda()
    modalAgenda.hide()
    setLoading(false)
}


export function updateStudentList() {
    const attendanceTable = document.getElementById('attendanceTable')
    const tbody = attendanceTable.querySelector('tbody')
    tbody.innerHTML = ''

    states.data.members.filter(student => student.id_class == states.id_class).forEach((student, i) => {
        tbody.innerHTML += `
    <tr>
                                    <td>${student.name}</td>
                                    <td><input type="radio" class='attendance' name='attendance_${i}' value='hadir' data-id='${student.id_member}' checked></td>
                                    <td><input type="radio" class='attendance' name='attendance_${i}' value='izin' data-id='${student.id_member}'></td>
                                    <td><input type="radio" class='attendance' name='attendance_${i}' value='sakit' data-id='${student.id_member}'></td>
                                    <td><input type="radio" class='attendance' name='attendance_${i}' value='alpha' data-id='${student.id_member}'></td>
   </tr>
`

    })
}

export function createModal() {
    return `<div class="modal fade" id="modal-agenda" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">

        <div class="modal-dialog modal-dialog-centered">

            <div class="modal-content">

                <div class="modal-header">

                    <h5 class="modal-title" id="exampleModalLabel">Tambah Agenda</h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                </div>

                <div class="modal-body">

                    <div class="mb-3">
                        <input type="hidden" class="form-control" id="id_schedule">
                    </div>

                    <div class="mb-3">
                        <label for="lesson" class="form-label">Materi yang diajarkan</label>
                        <input type="text" class="form-control" id="lesson" placeholder="Contoh: Pemrograman Dasar" data-rules='required'>
                        <div class="invalid-feedback">Tidak boleh kosong</div>
                    </div>

                    <div class="mb-3">
                        <label for="note" class="form-label">Catatan</label>
                        <textarea class="form-control" name="note" id="note" placeholder="Tambahkan Catatan Kelas"></textarea>
                    </div>

                    <div class="mb-3 attendance_section">
                        <label for="note" class="form-label">Kehadiran Siswa</label>
                         <div class="table-container">
                            <table class="table mb-0" id="attendanceTable">
                                <thead>
                                    <tr>
                                        <th>Nama Siswa</th>
                                        <th>Hadir</th>
                                        <th>Izin</th>
                                        <th>Sakit</th>
                                        <th>Alpha</th>
                                    </tr>
                                </thead>
                                <tbody id="studentList"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">

                    <button type="button" class="btn btn-close-modal" data-bs-dismiss="modal">Batal</button>
                    <button type="button" class="btn btn-primary btn-save-modal" id='save-agenda'>Simpan</button>

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

export function renderPagesAgenda(mainContent) {
    document.querySelector('.content-title').innerText = 'Data Agenda'
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
    <section id="page-agenda" class="p-4">
        <header class="d-flex justify-content-between align-items-center mb-4">
            <div class="search-wrapper"></div>
            <div class="header_action">
            <select class="form-select search-select" id="category" aria-label="select example" data-rules='required'>
                <option selected>Waktu</option>
                <option value="all">Semua</option>
                <option value="today">Hari Ini</option>
                <option value="week">Terbaru</option>
            </select>
            ${states.role == 'teacher' ? ` <button type="button" class="btn add-teacher" id="add-agenda">
                    <i class="fa-solid fa-plus me-2"></i>Tambah Agenda
                </button>`: ''
        }  
            </div>
        </header>

        <div class="table-responsive">
            <table class="table table-custom align-middle" id="table-agenda">
                <thead class="table-light">
                    <tr>
                    ${states.role == 'admin' ? '<th scope="col" class="text-center">Guru</th>' : ''
        }
                    <th scope="col" class="text-center">Kelas</th>
                    <th scope="col" class="text-center">Tanggal</th>
                    <th scope="col" class="text-center">Materi</th>
                    <th scope="col" class="text-center">Keterangan</th>
                    <th scope="col" class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </section>
    ${createModal()}
    ${createDeleteModal()}
    `
    updateAgenda()
    initEvent()
}

function updateAgenda(data = null) {
    const tableMajor = document.getElementById('table-agenda')
    const tbody = tableMajor.querySelector('tbody')
    let agendas = data ? data:states.data.agendas
    tbody.innerHTML = ''
    tbody.innerHTML += agendas.map(agenda =>
        ` <tr>
                        ${states.role == 'admin' ? `<td class="text-center">${agenda.teacher}</td>` : ''
        }
                      
                        <td class="text-center">${agenda.cls}</td>
                        <td class="text-center">${agenda.date}</td>
                        <td class="text-center">${agenda.lesson}</td>
                        <td class="text-center">${agenda.note}</td>
                        <td class="text-center">
                            <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-outline-info" data-id="${agenda.id_agenda}" title="Detail"><i
                            class="fa-solid fa-circle-info " title="Detail"></i></button>
                                
                                    ${states.role == 'teacher' ? `
                                        <button class="btn btn-sm btn-outline-warning" data-id="${agenda.id_agenda}" title="Edit">
                                    <i class="fa-solid fa-pen-to-square" title="Edit">
                                    </i></button>
                                        <button class="btn btn-sm btn-outline-danger" data-id="${agenda.id_agenda}" title="Hapus">
                                    <i class="fa-solid fa-trash" title="Hapus"></i>
                                </button>
                                        `: ''
        }
                                
                            </div>
                        </td>
            </tr>`
    ).join('')
}

/*  
handle event - showModal - save teacher - init event - update teacher - createModal - renderPages teacher
*/

