import { setLoading } from "../../setLoading.js";
import { states } from "../state.js"
import { api } from "../api.js";
import { showAlert } from "../state.js";
import { validateInput } from "../../validation.input.js";
let modalSubject;
let modalDeleteConfirm;
function handleEvent(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    let id = btn.getAttribute('data-id')

    if (e.target.title === 'Hapus') {
        document.getElementById('btn-confirm-delete').setAttribute('data-id', id)
        modalDeleteConfirm.show()
    } else if (e.target.title === 'Edit') {
        let data = states.data.subjects.find(subject => subject.id == id)
        showModal('Edit Pelajaran', data)
    }

}

function initEvent() {
    const table = document.getElementById('table-subject')
    const btn = document.querySelector('#modal-subject .btn-primary')
    const btn_triggerModal_add = document.getElementById('add-subject')
    const modal = document.getElementById('modal-subject')
    const deleteModalElem = document.getElementById('modal-delete-confirm')
    const btn_confirm_delete = document.getElementById('btn-confirm-delete')

    if (table) table.querySelector('tbody').addEventListener('click', handleEvent)

    if (btn_triggerModal_add) {
        btn_triggerModal_add.addEventListener('click', function () {
            showModal('Tambah Pelajaran')
        })
    }

    if (btn) btn.addEventListener('click', saveSubject)

    if (modal) modalSubject = bootstrap.Modal.getOrCreateInstance(modal)

    if (deleteModalElem) modalDeleteConfirm = bootstrap.Modal.getOrCreateInstance(deleteModalElem);

    if (btn_confirm_delete) {
        btn_confirm_delete.addEventListener('click', async function (e) {
            let id = e.target.getAttribute('data-id')
            setLoading(true)
            let result = await api.delete(`subjects/${id}`)
            if (result.ok) {
                states.data.subjects = states.data.subjects.filter(subject => subject.id != id)
                showAlert(true)
            } else {
                showAlert(false)
            }
            updateSubject()
            setLoading(false)
            modalDeleteConfirm.hide()
        })
    }

}

function showModal(title, data = {}) {
    const modalTitle = document.querySelector('#modal-subject .modal-title');
    modalTitle.innerText = title;

    const fields = ['code', 'name']
    fields.forEach(field => {
        const input = document.getElementById(field)
        input.value = data[field] || ''
    });

    const btnSave = document.querySelector('#modal-subject .btn-primary');

    btnSave.dataset.currentId = data.id || ''

    modalSubject.show()
}

async function saveSubject() {
    const id = document.querySelector('#modal-subject .btn-primary').getAttribute('data-current-id')
    const data = {
        code: document.getElementById('code').value,
        name: document.getElementById('name').value,
    };

    if(!validateInput()) return;

    setLoading(true)


    if (id) {
        let result = await api.patch(`subjects/${id}`, data)
        if (result.ok) {
            let index = states.data.subjects.findIndex(subject => subject.id == id)
            states.data.subjects[index] = result.data[0]
            showAlert(true)
        }else{
            showAlert(false)
        }
    } else {
        let result = await api.post('subjects', data)
        if (result.ok) {
            states.data.subjects.push(result.data[0])
            showAlert(true)
        }else{
            showAlert(false)
        }
    }

    updateSubject()
    setLoading(false)
    modalSubject.hide()
}



function createModal() {
    return `<div class="modal fade" id="modal-subject" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">

        <div class="modal-dialog modal-dialog-centered">

            <div class="modal-content">

                <div class="modal-header">

                    <h5 class="modal-title" id="exampleModalLabel"></h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                </div>

                <div class="modal-body">

                    <div class="mb-3">
                        <label for="code" class="form-label">Code Mapel</label>
                        <input type="text" class="form-control" id="code" placeholder="Contoh:MTK" data-rules='required'>
                        <div class="invalid-feedback">Tidak boleh kosong</div>
                    </div>

                    <div class="mb-3">
                        <label for="name" class="form-label">Nama Mapel</label>
                        <input type="text" class="form-control" id="name" placeholder="Contoh:Matematika" data-rules='required'>
                        <div class="invalid-feedback">Tidak boleh kosong</div>
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

export function renderPageSubject(mainContent) {
    document.querySelector('.content-title').innerText = 'Data Mapel'
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
    <section id="page-mapel" class="p-4">
        <header class="d-flex justify-content-between align-items-center mb-4">
            <div class="search-wrapper"></div>
            <div class="header_action">
                <button type="button" class="btn add-teacher" id="add-subject">
                    <i class="fa-solid fa-plus me-2"></i>Tambah Mapel
                </button>
            </div>
        </header>

        <div class="table-responsive">
            <table class="table table-custom align-middle" id="table-subject">
                <thead class="table-light">
                    <tr>
                        <th scope="col" class="text-center">Code Mapel</th>
                        <th scope="col" class="text-center">Mapel</th>
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
    updateSubject()
    initEvent()
}

function updateSubject() {
    const tableMajor = document.getElementById('table-subject')
    const tbody = tableMajor.querySelector('tbody')
    tbody.innerHTML = states.data.subjects.map(subject =>
        ` <tr>
                        <td class="text-center">${subject.code}</td>
                        <td class="text-center">${subject.name}</td>
                        <td class="text-center">
                            <div class="btn-group" role="group">
                                <button class="btn btn-sm btn-outline-warning" data-id="${subject.id}" title="Edit">
                                    <i class="fa-solid fa-pen-to-square" title="Edit">
                                    </i></button>
                                <button class="btn btn-sm btn-outline-danger" data-id="${subject.id}" title="Hapus">
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