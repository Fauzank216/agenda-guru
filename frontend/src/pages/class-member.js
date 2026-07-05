import { setLoading } from "../../setLoading.js";
import { api } from "../api.js";
import { showAlert, states } from "../state.js"
import { debounce } from "../../debounce.search.js";
let modalMember;
let modalDeleteConfirm;

let debounced = debounce((e) => {
    states.search_keyword = e.target.value
    if (e.target.value != '') {
    }
    document.getElementById('studentList').innerHTML = renderStudentList()
    states.search_keyword = ''
}, 500)

function handleEvent(e) {
    const btn = e.target.closest('button');
    let id = btn.getAttribute('data-id')
    if (!btn) return;

    if (e.target.title === 'Hapus') {
        document.getElementById('btn-confirm-delete').setAttribute('data-id', id)
        modalDeleteConfirm.show()
    }
}

function initEvent() {
    const table = document.getElementById('table-class-member')
    const btn_triggerModal_add = document.getElementById('add-class-member')
    const btn = document.querySelector('#modal-class-member .btn-primary')
    const modal = document.getElementById('modal-class-member')
    const search_studentEl = document.getElementById('search-siswa')
    const deleteModalElem = document.getElementById('modal-delete-confirm')
    const btn_confirm_delete = document.getElementById('btn-confirm-delete')

    if (table) table.querySelector('tbody').addEventListener('click', handleEvent)

    if (btn_triggerModal_add) {
        btn_triggerModal_add.addEventListener('click', function () {
            showModal('Tambah Siswa')
        })
    }

    if (btn) btn.addEventListener('click', saveMember)

    if (modal) modalMember = bootstrap.Modal.getOrCreateInstance(modal)

    if (search_studentEl) search_studentEl.addEventListener('input', debounced)

    if (deleteModalElem) modalDeleteConfirm = bootstrap.Modal.getOrCreateInstance(deleteModalElem)

    if (btn_confirm_delete) {
        btn_confirm_delete.addEventListener('click', async function (e) {
            let id = e.target.getAttribute('data-id')
            setLoading(true)
            let result = await api.put(`class_members/${id}`, { status: 'nonactive' })
            if (result.ok) {
                let indexStudent = states.data.students.findIndex(student => student.id == result.data[0].id_student)
                let indexMember = states.data.members.findIndex(member => member.id_member == result.data[0].id_member)
                states.data.members[indexMember] = result.data[0]
                states.data.students[indexStudent].status = result.data[0].status
                states.data.students[indexStudent].cls = null
                let index = states.data.classes.findIndex(cls => cls.id == states.id_class_detail)
                states.data.classes[index].total_members -= 1
                showAlert(true)
            } else {
                showAlert(false)
            }

            updateMember()
            modalDeleteConfirm.hide()
            setLoading(false)
        })
    }

}

function showModal(title, data = {}) {
    const modalTitle = document.querySelector('#modal-class-member .modal-title');
    modalTitle.innerText = title;

    renderStudentList()

    const btnSave = document.querySelector('#modal-class-member .btn-primary');

    btnSave.dataset.currentId = data.id || ''

    modalMember.show()
}

async function saveMember() {
    const members = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    let data = members.map(member => {
        return {
            id_class: states.id_class_detail,
            id_student: member.value
        }
    })

    setLoading(true)
    let results = await api.post('class_members', data)
    if (results.ok) {
        results.data.forEach(result => {
            if (states.data.members.some(member => member.id_member == result.id_member)) {
                let indexStudent = states.data.students.findIndex(student => student.id == result.id_student)
                let indexMember = states.data.members.findIndex(member => member.id_member == result.id_member)
                states.data.members[indexMember] = result
                states.data.students[indexStudent].status = result.status
                states.data.students[indexStudent].id_member = result.id_member
            } else {

                states.data.members.push(result)
                let indexStudent = states.data.students.findIndex(student => student.id == result.id_student)
                states.data.students[indexStudent].status = result.status
                states.data.students[indexStudent].id_member = result.id_member
                states.data.students[indexStudent].cls = result.cls

            }
        })

        let index = states.data.classes.findIndex(cls => cls.id == states.id_class_detail)
        states.data.classes[index].total_members += data.length

        showAlert(true)
    } else {
        showAlert(false)
    }

    updateMember()
    modalMember.hide()
    setLoading(false)
}

function renderStudentList() {
    const studentList = document.getElementById('studentList')
    let students = states.data.students.filter(student => student.status == 'nonactive' || student.cls == null)
    studentList.innerHTML = students.map(student => `<tr>
                                            <td>${student.nisn}</td>
                                            <td>${student.name}</td>
                                            <td><input type="checkbox" value='${student.id}'></td>
                                            </tr>
                                    `
    ).join('')
}

function createModal() {
    return `<div class="modal fade" id="modal-class-member" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">

        <div class="modal-dialog modal-dialog-centered">

            <div class="modal-content">

                <div class="modal-header">

                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                </div>

                <div class="modal-body">
                    <div class="mb-3">
                        <label for="search-siswa" class="form-label">Cari Siswa</label>
                        <input type='search' id='search-siswa' class="form-control" placeholder="Masukan Nama">
                    </div>
                    <div class="mb-3">
                        <label for="cls" class="form-label">Pilih Siswa</label>
                         <div class="table-container">
                            <table class="table mb-0" id="attendanceTable">
                                <thead>
                                    <tr>
                                        <th>Nis</th>
                                        <th>Nama Siswa</th>
                                        <th>Tambah</th>
                                    </tr>
                                </thead>
                                <tbody id="studentList"></tbody>
                            </table>
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

export function renderPageClassDetail(mainContent) {
    document.querySelector('.content-title').innerText = 'Data Detail'
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
    <section id="page-class-member" class="p-4">
        <header class="d-flex justify-content-between align-items-center mb-4">
            <div class="search-wrapper"></div>
            <div class="header_action">
                <button type="button" class="btn add-teacher" id="add-class-member">
                    <i class="fa-solid fa-plus me-2"></i>Tambah Murid
                </button>
            </div>
        </header>

        <div class="table-responsive">
            <table class="table table-custom align-middle" id="table-class-member">
                <thead class="table-light">
                    <tr>
                    <th scope="col" class="text-center">NIS</th>
                        <th scope="col" class="text-center">Nama</th>
                        <th scope="col" class="text-center">Kehadiran</th>
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
    updateMember()
    initEvent()
}

function updateMember() {
    const tableMember = document.getElementById('table-class-member')
    const tbody = tableMember.querySelector('tbody')
    let members = states.data.members.filter(member => member.id_class == states.id_class_detail && member.status == 'active')
    if (members) {
        tbody.innerHTML = members.map(member =>
            `<tr>
        <td class="text-center">${member.nisn}</td>
        <td class="text-center">${member.name}</td>
        <td class="text-center">${member.persentase == null ? '0%' : member.persentase}</td>
                        <td class="text-center">
                            <div class="btn-group" role="group">
                                <button class="btn btn-sm btn-outline-danger" data-id="${member.id_member}" title="Hapus">
                                    <i class="fa-solid fa-trash" title="Hapus"></i>
                                </button>
                            </div>
                        </td>
            </tr>`
        ).join('')
    }

}