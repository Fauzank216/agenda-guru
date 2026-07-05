import { setLoading } from "../../setLoading.js";
import { api } from "../api.js";
import { showAlert, states } from "../state.js"
import { renderPageClassDetail } from "./class-member.js";
import { validateInput } from "../../validation.input.js";
let modalClass;
let modalDeleteConfirm;

async function handleEvent(e) {
    const btn = e.target.closest('button');
    let id = btn.getAttribute('data-id')
    if (!btn) return;

    if (e.target.title === 'Hapus') {
        document.getElementById('btn-confirm-delete').setAttribute('data-id', id)
        modalDeleteConfirm.show()
    } else if (e.target.title === 'Edit') {
        let data = states.data.classes.find(cls => cls.id == id)
        showModal('Edit Kelas', data)
    } else if (e.target.title === 'Detail') {
        setLoading(true)
        states.id_class_detail = id
        let isLoaded = states.data.members.some(member => member.id_class == id)
        if (!isLoaded) {
            let result = await api.get(`class_members/${id}`)
            if (result.ok) {
                states.data.members.push(...result.data)
                const app = document.getElementById('app')
            }
        }
        renderPageClassDetail(app)
        setLoading(false)
    }

}

function initEvent() {
    const table = document.getElementById('table-class')
    const btn_triggerModal_add = document.getElementById('add-class')
    const btn = document.querySelector('#modal-class .btn-primary')
    const modal = document.getElementById('modal-class')
    const deleteModalElem = document.getElementById('modal-delete-confirm')
    const btn_confirm_delete = document.getElementById('btn-confirm-delete')

    if (table) table.querySelector('tbody').addEventListener('click', handleEvent)

    if (btn_triggerModal_add) {
        btn_triggerModal_add.addEventListener('click', function () {
            showModal('Tambah Kelas')
        })
    }

    if (btn) btn.addEventListener('click', saveCls)

    if (modal) modalClass = bootstrap.Modal.getOrCreateInstance(modal)

    if (deleteModalElem) modalDeleteConfirm = bootstrap.Modal.getOrCreateInstance(deleteModalElem)

    if (btn_confirm_delete) {
        btn_confirm_delete.addEventListener('click', async function (e) {
            setLoading(true)
            let id = e.target.getAttribute('data-id')
            let result = await api.delete(`classes/${id}`)
            if (result.ok) {
                states.data.classes = states.data.classes.filter(cls => cls.id != id)
                showAlert(true)
            } else {
                showAlert(false)
            }
            updateCls()
            modalDeleteConfirm.hide()
            setLoading(false)
        })
    }
}

function showModal(title, data = {}) {
    const modalTitle = document.querySelector('#modal-class .modal-title');
    modalTitle.innerText = title;

    const fields = ['grade', 'id_major', 'cls']
    fields.forEach(field => {
        const input = document.getElementById(field)
        input.value = data[field] || ''
    });

    const btnSave = document.querySelector('#modal-class .btn-primary');

    btnSave.dataset.currentId = data.id || ''

    modalClass.show()
}

async function saveCls() {
    const id = document.querySelector('#modal-class .btn-primary').getAttribute('data-current-id')
    const data = {
        grade: document.getElementById('grade').value,
        id_major: document.getElementById('id_major').value,
        cls: document.getElementById('cls').value,
    };

    if(!validateInput()) return;

    setLoading(true)
    if (id) {
        let result = await api.patch(`classes/${id}`, data)
        if (result.ok) {
            let index = states.data.classes.findIndex(cls => cls.id == id)
            states.data.classes[index] = result.data[0]
            showAlert(true)
        } else {
            showAlert(false)
        }
    } else {
        let result = await api.post(`classes`, data)
        if (result.ok) {
            states.data.classes.push(result.data[0])
            showAlert(true)
        } else {
            showAlert(false)
        }
    }

    updateCls()
    modalClass.hide()
    setLoading(false)
}



function createModal() {
    return `<div class="modal fade" id="modal-class" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">

        <div class="modal-dialog modal-dialog-centered">

            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">

                    <div class="mb-3">
                        <label for="grade" class="form-label">Tingkat</label>
                        <select id="grade" class="form-select" data-rules='required'>
                         <option value="X">X</option>
                         <option value="XI">XI</option>
                         <option value="XII">XII</option>
                        </select>
                        <div class="invalid-feedback">Tidak boleh kosong</div>
                    </div>

                    <div class="mb-3">
                        <label for="id_major" class="form-label">Jurusan</label>
                        <select id="id_major" class="form-select" data-rules='required'>
                        ${states.data.majors.map(major => {
        return `<option value="${major.id}">${major.name}</option>`
    }).join('')}
                        </select>
                        <div class="invalid-feedback">Tidak boleh kosong</div>
                    </div>

                    <div class="mb-3">
                        <label for="cls" class="form-label">Kelas</label>
                        <input type="text" class="form-control" id="cls" data-rules='required'>
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

export function renderPageClass(mainContent) {
    document.querySelector('.content-title').innerText = 'Data Kelas'
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
    <section id="page-kelas" class="p-4">
        <header class="d-flex justify-content-between align-items-center mb-4">
            <div class="search-wrapper"></div>
            <div class="header_action">
                <button type="button" class="btn add-teacher" id="add-class">
                    <i class="fa-solid fa-plus me-2"></i>Tambah Kelas
                </button>
            </div>
        </header>

        <div class="table-responsive">
            <table class="table table-custom align-middle" id="table-class">
                <thead class="table-light">
                    <tr>
                    <th scope="col" class="text-center">Kelas</th>
                        <th scope="col" class="text-center">Jurusan</th>
                        <th scope="col" class="text-center">Total Murid</th>
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
    updateCls()
    initEvent()
}

function updateCls() {
    const tableMajor = document.getElementById('table-class')
    const tbody = tableMajor.querySelector('tbody')
    tbody.innerHTML = states.data.classes.map(cls =>
        ` <tr>
        <td class="text-center">${cls.name}</td>
        <td class="text-center">${cls.major}</td>
        <td class="text-center">${cls.total_members}</td>
                        <td class="text-center">
                            <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-outline-info" data-id="${cls.id}" title="Detail"><i
                            class="fa-solid fa-circle-info " title="Detail"></i></button>
                                <button class="btn btn-sm btn-outline-warning" data-id="${cls.id}" title="Edit">
                                    <i class="fa-solid fa-pen-to-square" title="Edit">
                                    </i></button>
                                <button class="btn btn-sm btn-outline-danger" data-id="${cls.id}" title="Hapus">
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