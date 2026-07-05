import { states } from "../state.js"
import { api } from '../api.js'
import { debounce } from "../../debounce.search.js";
import { setLoading } from "../../setLoading.js";
import { showAlert } from "../state.js";
import { validateInput } from "../../validation.input.js";
let modalUser;
let modalDeleteConfirm;

let debounced = debounce((e) => {
    states.search_keyword = e.target.value
    if (e.target.value != '') {
    }
    updateUser()
    states.search_keyword = ''
}, 500)

function handleEvent(e) {
    const btn = e.target.closest('button');

    if (!btn) return;
    let id = btn.getAttribute('data-id')

    if (e.target.title === 'Hapus') {
        document.getElementById('btn-confirm-delete').setAttribute('data-id', id)
        modalDeleteConfirm.show()
    } else if (e.target.title === 'Edit') {
        let data = states.data.users.find(user => user.id == id)
        showModal('Edit Guru', data, 'edit')
    }

}

function initEvent() {
    const table = document.getElementById('table-user')
    const btn_triggerModal_add = document.getElementById('add-user')
    const btn = document.querySelector('#modal-user .btn-primary')
    const modal = document.getElementById('modal-user')
    const deleteModalElem = document.getElementById('modal-delete-confirm');
    const btn_confirm_delete = document.getElementById('btn-confirm-delete')
    const search_teacherEl = document.getElementById('search-guru')
    if (table) table.querySelector('tbody').addEventListener('click', handleEvent)

    if (btn_triggerModal_add) {
        btn_triggerModal_add.addEventListener('click', function () {
            showModal('Tambah Guru')
        })
    }

    if (btn) btn.addEventListener('click', saveUser)

    if (modal) modalUser = bootstrap.Modal.getOrCreateInstance(modal)

    if (deleteModalElem) modalDeleteConfirm = bootstrap.Modal.getOrCreateInstance(deleteModalElem);

    if (search_teacherEl) search_teacherEl.addEventListener('input', debounced)

    

    if (btn_confirm_delete) {
        btn_confirm_delete.addEventListener('click', async function (e) {
            setLoading(true)
            let id = e.target.getAttribute('data-id')
            let result = await api.delete(`users/${id}`)
            if (result.ok) {
                states.data.users = states.data.users.filter(user => user.id != id)
                updateUser()
                showAlert(true)
            } else {
                showAlert(false)
            }
            setLoading(false)
            modalDeleteConfirm.hide()
        })
    }
}

function showModal(title, data = {}, action = 'add') {
    const modalTitle = document.querySelector('#modal-user .modal-title');
    modalTitle.innerText = title;

    const fields = ['nip', 'name', 'email', 'password']
    fields.forEach(field => {
        const input = document.getElementById(field)

        if (input.type == 'file') {
            input.value = ""
        } else {
            if (action == 'edit' && input.type == 'password') {
                input.readOnly = true
                input.value = '******'
            } else {
                input.readOnly = false
                input.value = data[field] || ''
            }
        }
    });

    const btnSave = document.querySelector('#modal-user .btn-primary');

    btnSave.dataset.currentId = data.id || ''

    modalUser.show()
}

async function saveUser() {
    const id = document.querySelector('#modal-user .btn-primary').getAttribute('data-current-id')
    const data = {
        nip: document.getElementById('nip').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    if (!validateInput()) return;

    setLoading(true)
    if (id) {
        let result = await api.patch(`users/profile/${id}`, data)

        if (result.ok) {
            let index = states.data.users.findIndex(user => user.id == id)
            states.data.users[index] = result.data[0]
            showAlert(true)
        } else {
            showAlert(false)
        }

    } else {

        let result = await api.post('users', data)
        if (result.ok) {
            states.data.users.push(result.data[0])
            showAlert(true)
        } else {
            showAlert(false)
        }
    }

    updateUser()
    setLoading(false)
    modalUser.hide()
}

function createModal() {
    return `<div class="modal fade" id="modal-user" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">

        <div class="modal-dialog modal-dialog-centered">

            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body p-4">

                    <div class="mb-3">
                        <label for="nip" class="form-label">NIP</label>
                        <input type="text" class="form-control" id="nip" placeholder="Masukan Nip" data-rules='required|unique'>
                        <div class="invalid-feedback">Tidak boleh kosong</div>
                    </div>

                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" class="form-control" id="name" placeholder="Nama Lengkap" data-rules='required'>
                        <div class="invalid-feedback">Tidak boleh kosong</div>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="text" class="form-control" id="email" placeholder="example@school.com" data-rules='required|unique'>
                        <div class="invalid-feedback">Tidak boleh kosong</div>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" placeholder="******" data-rules='required'>
                        <div class="invalid-feedback">Tidak boleh kosong</div>
                    </div>

                </div>

                <div class="modal-footer">

                    <button type="button" class="btn btn-close-modal" data-bs-dismiss="modal">Batal</button>

                    <button type="button" class="btn btn-primary btn-save-modal">Simpan</button>

                </div>

            </div>

        </div>

    </div>
    `

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

export function renderPageUser(mainContent) {
    document.querySelector('.content-title').innerText = 'Data Guru'
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
    <section id="page-user" class="p-4">
        <header class="d-flex justify-content-between align-items-center mb-4">
            <div class="search-wrapper">
                <label for="search-guru" class="visually-hidden">Cari Guru</label>
                <input class="form-control" id="search-guru" type="search"
                    placeholder="Cari nama atau NIP...">
            </div>
            <div class="header_action">
                <button type="button" class="btn add-teacher" id="add-user">
                    <i class="fa-solid fa-plus me-2"></i>Tambah Guru
                </button>
            </div>
        </header>

        <div class="table-responsive">
            <table class="table table-custom align-middle" id="table-user">
                <thead class="table-light">
                    <tr>
                        <th scope="col" class="text-center">NIP</th>
                        <th scope="col" class="text-center">Guru</th>
                        <th scope="col" class="text-center th-optional">Email</th>
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
    ${createModal()}
     ${createDeleteModal()}
    `
    updateUser()
    initEvent()
}

function updateUser() {
    const tableuser = document.getElementById('table-user')
    const tbody = tableuser.querySelector('tbody')
    let users = states.data.users.filter(user => user.name.toLowerCase().includes(states.search_keyword.toLowerCase()))
    tbody.innerHTML = users.map(user =>
        ` <tr>
                        <td class="text-center">${user.nip}</td>
                        <td class="text-center">${user.name}</td>
                        <td class="text-center">${user.email}</td>
                        <td class="text-center">
                            <div class="btn-group" role="group">
                                <button class="btn btn-sm btn-outline-warning" data-id="${user.id}" title="Edit">
                                    <i class="fa-solid fa-pen-to-square" title="Edit">
                                    </i></button>
                                <button class="btn btn-sm btn-outline-danger" data-id="${user.id}" title="Hapus">
                                    <i class="fa-solid fa-trash" title="Hapus"></i>
                                </button>
                            </div>
                        </td>
            </tr>`
    ).join('')
}

/*  
handle event - showModal - save user - init event - update user - createModal - renderPages user
*/ 