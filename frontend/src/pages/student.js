import { setLoading } from "../../setLoading.js";
import { api } from "../api.js";
import { showAlert, states } from "../state.js"
import { debounce } from "../../debounce.search.js";
import { validateInput } from "../../validation.input.js";

let modalStudent;
let modalDeleteConfirm;

let debounced = debounce((e) => {
    states.search_keyword = e.target.value
    if (e.target.value != '') {

    }
    updateStudent()
    states.search_keyword = ''
}, 500)


function handleEvent(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    let id = btn.getAttribute('data-id')

    if (e.target.title === 'Hapus') {
        modalDeleteConfirm.show()
        document.getElementById('btn-confirm-delete').setAttribute('data-id', id)
        modalDeleteConfirm.show()
    } else if (e.target.title === 'Edit') {
        let data = states.data.students.find(student => student.id == id)
        showModal('Edit Siswa', data)
    }

}

async function handleImport(e) {
    const file = e.target.files[0]
    const formData = new FormData()

    if(!file){
        return
    }

    if(file.size === 0){
        return
    }

    formData.append('excel', file)
    setLoading(true)
    let result = await fetch('http://localhost:3000/api/students/excel', {
        method: "POST",
        headers: {
            authorization: `Bearer ${states.token}`
        },
        body: formData
    })

    if (result.status == 200) {
        let json = await result.json()
        let data = json.data
        states.data.students.push(...data)
        updateStudent()
        showAlert(true)
    } else {
        showAlert(false)
    }
    setLoading(false)
    e.target.value = ""

}

function initEvent() {
    const table = document.getElementById('table-student')
    const btn_triggerModal_add = document.getElementById('add-student')
    const btn = document.querySelector('#modal-student .btn-primary')
    const modal = document.getElementById('modal-student')
    const search_studentEl = document.getElementById('search-siswa')
    const deleteModalElem = document.getElementById('modal-delete-confirm')
    const btn_confirm_delete = document.getElementById('btn-confirm-delete')
    const importFileEl = document.getElementById('import-student')

    if (table) table.querySelector('tbody').addEventListener('click', handleEvent)

    if (btn_triggerModal_add) {
        btn_triggerModal_add.addEventListener('click', function () {
            showModal('Tambah Siswa')
        })
    }

    if (btn) btn.addEventListener('click', saveStudent)

    if (modal) modalStudent = bootstrap.Modal.getOrCreateInstance(modal)

    if (search_studentEl) search_studentEl.addEventListener('input', debounced)

    if (deleteModalElem) modalDeleteConfirm = bootstrap.Modal.getOrCreateInstance(deleteModalElem)

    if (btn_confirm_delete) {
        btn_confirm_delete.addEventListener('click', async function (e) {
            let id = e.target.getAttribute('data-id')
            setLoading(true)
            let result = await api.delete(`students/${id}`)
            if (result.ok) {
                states.data.students = states.data.students.filter(student => student.id != id)
                showAlert(true)
            } else {
                showAlert(false)
            }
            updateStudent()
            setLoading(false)
            modalDeleteConfirm.hide()
        })
    }

    if (importFileEl) {
        importFileEl.addEventListener('change', handleImport)
    }
}

function showModal(title, data = {}) {
    const modalTitle = document.querySelector('#modal-student .modal-title');
    modalTitle.innerText = title;

    const fields = ['nisn', 'name']
    fields.forEach(field => {
        const input = document.getElementById(field)
        input.value = data[field] || ''
    });

    const btnSave = document.querySelector('#modal-student .btn-primary');

    btnSave.dataset.currentId = data.id || ''

    modalStudent.show()
}

async function saveStudent() {
    const id = document.querySelector('#modal-student .btn-primary').getAttribute('data-current-id')
    const data = {
        nisn: document.getElementById('nisn').value,
        name: document.getElementById('name').value,
    }

    if (!validateInput()) return;

    setLoading(true)
    if (id) {
        let result = await api.patch(`students/profile/${id}`, data)
        if (result.ok) {
            let index = states.data.students.findIndex(student => student.id == id)
            states.data.students[index] = result.data[0]
            showAlert(true)
        } else {
            showAlert(false)
        }
    } else {
        let result = await api.post('students', data)
        if (result.ok) {
            states.data.students.push(result.data[0])
            showAlert(true)
        } else {
            showAlert(false)
        }
    }
    updateStudent()
    setLoading(false)

    modalStudent.hide()
}



function createModal() {
    return `<div class="modal fade" id="modal-student" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">

        <div class="modal-dialog modal-dialog-centered">

            <div class="modal-content">

                <div class="modal-header">

                    <h5 class="modal-title" id="exampleModalLabel"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                </div>

                <div class="modal-body">

                    <div class="mb-3">
                        <label for="nisn" class="form-label">NIS</label>
                        <input type="text" class="form-control" id="nisn" placeholder="Masukan Nis" data-rules='required|unique'>
                        <div class="invalid-feedback">Tidak boleh kosong</div>
                    </div>

                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" class="form-control" id="name" placeholder="Nama Lengkap" data-rules='required'>
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

export function renderPageStudent(mainContent) {
    document.querySelector('.content-title').innerText = 'Data Siswa'
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
    <section id="page-student" class="p-4">
        <header class="d-flex justify-content-between align-items-center mb-4">
            <div class="search-wrapper">
                <label for="search-siswa" class="visually-hidden">Cari Siswa</label>
                <input class="form-control" id="search-siswa" type="search"
                    placeholder="Cari nama atau NIS...">
            </div>
            <div class="header_action">
                <input type="file" id="import-student" placeholder="Import Excel">
                <button type="button" class="btn add-teacher" id="add-student">
                    <i class="fa-solid fa-plus me-2"></i>Tambah Siswa
                </button>
            </div>
        </header>

        <div class="table-responsive">
            <table class="table table-custom align-middle" id="table-student">
                <thead class="table-light">
                    <tr>
                        <th scope="col" class="text-center">NISN</th>
                        <th scope="col" class="text-center">Nama</th>
                        <th scope="col" class="text-center">Kelas</th>
                        <th scope="col" class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>

            <nav aria-label="Navigasi halaman siswa" class="d-flex justify-content-end">
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
    updateStudent()
    initEvent()
}

function updateStudent() {
    const tableStudent = document.getElementById('table-student')
    const tbody = tableStudent.querySelector('tbody')
    let students = states.data.students.filter(student => student.name.toLowerCase().includes(states.search_keyword.toLowerCase()))
    console.log('student di render')
    tbody.innerHTML = students.map(student =>
        ` <tr>
                        <td class="text-center">${student.nisn}</td>
                        <td class="text-center">${student.name}</td>
                        <td class="text-center">${student.cls == null ? '-' : student.cls}</td>
                        <td class="text-center">
                            <div class="btn-group" role="group">
                                <button class="btn btn-sm btn-outline-warning" data-id="${student.id}" title="Edit">
                                    <i class="fa-solid fa-pen-to-square" title="Edit">
                                    </i></button>
                                <button class="btn btn-sm btn-outline-danger" data-id="${student.id}" title="Hapus">
                                    <i class="fa-solid fa-trash" title="Hapus"></i>
                                </button>
                            </div>
                        </td>
            </tr>`
    ).join('')
}
/*  
handle event - showModal - save Student - init event - update Student - createModal - renderPages Student
*/ 