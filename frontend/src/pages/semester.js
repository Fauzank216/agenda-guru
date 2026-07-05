import { setLoading } from "../../setLoading.js";
import { api } from "../api.js";
import { showAlert, states } from "../state.js"
import { validateInput } from "../../validation.input.js";

let modalSemester;
let modalDeleteConfirm;

function handleEvent(e) {
    const btn = e.target.closest('button');
    let id = btn.getAttribute('data-id')
    if (!btn) return;

    if (e.target.title === 'Hapus') {
        document.getElementById('btn-confirm-delete').setAttribute('data-id', id)
        modalDeleteConfirm.show()
    } else if (e.target.title === 'Edit') {
        let data = states.data.semesters.find(semester => semester.id == id)
        console.log(id)
        showModal('Edit Semester', data)
    } else if (e.target.title === 'Detail') {
        showModal('Pofile')
    }

}

function initEvent() {
    const table = document.getElementById('table-semester')
    const btn_triggerModal_add = document.getElementById('add-semester')
    const btn = document.querySelector('#modal-semester .btn-primary')
    const modal = document.getElementById('modal-semester')
    const deleteModalElem = document.getElementById('modal-delete-confirm')
    const btn_confirm_delete = document.getElementById('btn-confirm-delete')

    if (table) table.querySelector('tbody').addEventListener('click', handleEvent)

    if (btn_triggerModal_add) {
        btn_triggerModal_add.addEventListener('click', function () {
            showModal('Tambah Semester')
        })
    }

    if (btn) btn.addEventListener('click', saveSemester)

    if (modal) modalSemester = bootstrap.Modal.getOrCreateInstance(modal)

    if (deleteModalElem) modalDeleteConfirm = bootstrap.Modal.getOrCreateInstance(deleteModalElem)

    if (btn_confirm_delete) {
        btn_confirm_delete.addEventListener('click', async function (e) {
            let id = e.target.getAttribute('data-id')
            setLoading(true)
            let result = await api.delete(`semesters/${id}`)
            if (result.ok) {
                states.data.semesters = states.data.semesters.filter(semester => semester.id != id)
                showAlert(true)
            } else {
                showAlert(false)
            }
            updateSemester()
            setLoading(false)
            modalDeleteConfirm.hide()
        })
    }

}

function showModal(title, data = {}) {
    const modalTitle = document.querySelector('#modal-semester .modal-title');
    modalTitle.innerText = title;

    const fields = ['academic_year', 'date_start', 'date_end', 'is_active']
    fields.forEach(field => {
        const input = document.getElementById(field)
        input.value = data[field] || ''
    });

    const btnSave = document.querySelector('#modal-semester .btn-primary');

    btnSave.dataset.currentId = data.id || ''

    modalSemester.show()
}

async function saveSemester() {
    const id = document.querySelector('#modal-semester .btn-primary').getAttribute('data-current-id')
    const data = {
        academic_year: document.getElementById('academic_year').value,
        date_start: document.getElementById('date_start').value,
        date_end: document.getElementById('date_end').value,
        is_active:document.getElementById('is_active').value
    };

    if (!validateInput()) return;

    setLoading(true)
    if (id) {
        let result = await api.patch(`semesters/${id}`, data)
        if (result.ok) {
            let index = states.data.semesters.findIndex(semester => semester.id == id)
            states.data.semesters[index] = result.data[0]
            showAlert(true)
        } else {
            showAlert(false)
        }
    } else {
        let result = await api.post(`semesters`, data)
        if (result.ok) {
            states.data.semesters.push(result.data[0])
            showAlert(true)
        } else {
            showAlert(false)
        }
    }
    updateSemester()
    setLoading(false)
    modalSemester.hide()
}



function createModal() {
    return `<div class="modal fade" id="modal-semester" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">

        <div class="modal-dialog modal-dialog-centered">

            <div class="modal-content">

                <div class="modal-header">

                    <h5 class="modal-title" id="exampleModalLabel"></h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                </div>

                <div class="modal-body">

                    <div class="mb-3">
                        <label for="academic_year" class="form-label">Tahun Ajar</label>
                        <input type="text" class="form-control" id="academic_year" placeholder="Contoh:2024/2025" data-rules='required'>
                    <div class="invalid-feedback">Tidak boleh kosong</div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="date_start" class="form-label">Tanggal Mulai</label>
                        <input type="text" class="form-control" id="date_start" placeholder="Contoh:2024-05-04" data-rules='required'>
                    <div class="invalid-feedback">Tidak boleh kosong</div>
                    </div>

                    <div class="mb-3">
                        <label for="date_end" class="form-label">Tanggal Selesai</label>
                        <input type="text" class="form-control" id="date_end" placeholder="Contoh:2025-05-04" data-rules='required'>
                    <div class="invalid-feedback">Tidak boleh kosong</div>
                    </div>

                    <div class="mb-3">
                        <label for="is_active" class="form-label">Status</label>
                         <select id="is_active" class="form-select">
                         <option value="0">Tidak Aktif</option>
                         <option value="1">Aktif</option>
                        </select>
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

export function renderPageSemester(mainContent) {
    document.querySelector('.content-title').innerText = 'Data Semester'
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
    <section id="page-semester" class="p-4">
        <header class="d-flex justify-content-between align-items-center mb-4">
            <div class="search-wrapper"></div>
            <div class="header_action">
                <button type="button" class="btn add-teacher" id="add-semester">
                    <i class="fa-solid fa-plus me-2"></i>Tambah Semester
                </button>
            </div>
        </header>

        <div class="table-responsive">
            <table class="table table-custom align-middle" id="table-semester">
                <thead class="table-light">
                    <tr>
                        <th scope="col" class="text-center">Tahun Ajar</th>
                        <th scope="col" class="text-center">Mulai</th>
                        <th scope="col" class="text-center">Selesai</th>
                        <th scope="col" class="text-center">Status</th>
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
    updateSemester()
    initEvent()
}

function updateSemester() {
    const tableSemester = document.getElementById('table-semester')
    const tbody = tableSemester.querySelector('tbody')
    tbody.innerHTML = states.data.semesters.map(semester =>
        ` <tr>
                        <td class="text-center">${semester.academic_year}</td>
                        <td class="text-center">${semester.date_start.split('T')[0]}</td>
                        <td class="text-center">${semester.date_end.split('T')[0]}</td>
                        <td class="text-center">${semester.is_active == 1 ? 'active' : 'nonactive'}</td>
                        <td class="text-center">
                            <div class="btn-group" role="group">
                                <button class="btn btn-sm btn-outline-warning" data-id="${semester.id}" title="Edit">
                                    <i class="fa-solid fa-pen-to-square" title="Edit">
                                    </i></button>
                                <button class="btn btn-sm btn-outline-danger" data-id="${semester.id}" title="Hapus">
                                    <i class="fa-solid fa-trash" title="Hapus"></i>
                                </button>
                            </div>
                        </td>
            </tr>`
    ).join('')
}

/*  
handle event - showModal - save teacher - init event - update teacher - createModal - renderPages teacher
*/ 