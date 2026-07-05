import { setLoading } from "../../setLoading.js";
import { api } from "../api.js";
import { showAlert, states } from "../state.js"
import { validateInput } from "../../validation.input.js";

let modalAgendaDetail;
let modalDeleteConfirm;
function handleEvent(e) {
    const btn = e.target.closest('button');
    let id = btn.getAttribute('data-id')
    if (!btn) return;

    if (e.target.title === 'Edit') {
        let data = states.data.agenda_detail.find(detail => detail.id_detail == id)
        showModal('Edit Detail', data)
    }

}

function initEvent() {
    const table = document.getElementById('table-agenda-detail')
    const btn = document.querySelector('#modal-agenda-detail .btn-primary')
    const modal = document.getElementById('modal-agenda-detail')
    const deleteModalElem = document.getElementById('modal-delete-confirm')

    if (table) table.querySelector('tbody').addEventListener('click', handleEvent)

    if (btn) btn.addEventListener('click', saveAgendaDetail)

    if (modal) modalAgendaDetail = bootstrap.Modal.getOrCreateInstance(modal)

    if (deleteModalElem) modalDeleteConfirm = bootstrap.Modal.getOrCreateInstance(deleteModalElem)

}

function showModal(title, data = {}) {
    const modalTitle = document.querySelector('#modal-agenda-detail .modal-title');
    modalTitle.innerText = title;

    const fields = ['status_attendance', 'note', 'name']
    fields.forEach(field => {
        const input = document.getElementById(field)
        input.value = data[field] || ''
    });

    const btnSave = document.querySelector('#modal-agenda-detail .btn-primary');

    btnSave.dataset.currentId = data.id_detail || ''

    modalAgendaDetail.show()
}

async function saveAgendaDetail() {
    const id = document.querySelector('#modal-agenda-detail .btn-primary').getAttribute('data-current-id')
    const data = {
        status_attendance: document.getElementById('status_attendance').value,
        note: document.getElementById('note').value,
    };
    
    if(!validateInput()) return;

    setLoading(true)
    
    if (id) {
        let result = await api.patch(`agenda_details/${id}`, data)
        if (result.ok) {
            let index = states.data.agenda_detail.findIndex(detail => detail.id_detail == id)
            states.data.agenda_detail[index] = result.data[0]
            console.log(states.data.agenda_detail)
            showAlert(true)
        } else {
            showAlert(false)
        }
    }

    updateAgendaDetail()
    modalAgendaDetail.hide()
    setLoading(false)
}



function createModal() {
    return `<div class="modal fade" id="modal-agenda-detail" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">

        <div class="modal-dialog modal-dialog-centered">

            <div class="modal-content">

                <div class="modal-header">

                    <h5 class="modal-title" id="exampleModalLabel"></h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                </div>

                <div class="modal-body">
                    <div class="mb-3">
                        <label for="name" class="form-label">Nama</label>
                        <input type="text" class="form-control" id="name" readonly>
                    </div>

                    <div class='mb-3'>
                        <label for="status_attendance" class="form-label">Kehadiran</label>
                        <select class='form-select' id='status_attendance'>
                            <option value='hadir'>Hadir</option>
                            <option value='izin'>Izin</option>
                            <option value='sakit'>Sakit</option>
                            <option value='alpha'>Alpha</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="note" class="form-label">Keterangan</label>
                        <input type="text" class="form-control" id="note" placeholder="">
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

export function renderPagesAgendaDetail(mainContent) {
    document.querySelector('.content-title').innerText = 'Data Agenda'
    mainContent.innerHTML = ''
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
    <section id="page-agenda-detail" class="p-4">
        <header class="d-flex justify-content-between align-items-center mb-4">
            <div class="search-wrapper"></div>
            <div class="header_action"></div>
        </header>

        <div class="table-responsive">
            <table class="table table-custom align-middle" id="table-agenda-detail">
                <thead class="table-light">
                    <tr>
                    <th scope="col" class="text-center">Nis</th>
                    <th scope="col" class="text-center">Nama</th>
                    <th scope="col" class="text-center">Status</th>
                    <th scope="col" class="text-center">Note</th>
                    ${states.role == 'teacher' ? `
                        <th scope="col" class="text-center">Aksi</th>
                        `: ''
        }
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </section>
    ${createModal()}
    ${createDeleteModal()}
    `
    updateAgendaDetail()
    initEvent()
}

function updateAgendaDetail() {
    const tableAgendaDetail = document.getElementById('table-agenda-detail')
    const tbody = tableAgendaDetail.querySelector('tbody')
    let filteredDetail = states.data.agenda_detail.filter(detail => detail.id_agenda == states.id_agenda)
    tbody.innerHTML = filteredDetail.map(detail =>
        ` <tr>
                        <td class="text-center">${detail.nis}</td>
                        <td class="text-center">${detail.name}</td>
                        <td class="text-center">${detail.status_attendance}</td>
                        <td class="text-center">${detail.note}</td>
                        ${states.role == 'teacher' ? `
                            <td class="text-center">
                                <div class="btn-group" role="group">
                                    <button class="btn btn-sm btn-outline-warning" data-id="${detail.id_detail}" title="Edit">
                                        <i class="fa-solid fa-pen-to-square" title="Edit">
                                        </i></button>
                                </div>
                            </td>
                            `: ''
        }
            </tr>`
    ).join('')
}

/*  
handle event - showModal - save teacher - init event - update teacher - createModal - renderPages teacher
*/

