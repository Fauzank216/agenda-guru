import { debounce } from "../../debounce.search.js"
import { states } from "../state.js"
import { api } from "../api.js"
import { setLoading } from "../../setLoading.js"
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
        ul.onclick = async (e) => {
            let value = e.target.textContent.toLowerCase()
            ul.style.display = 'none'
            if (filteredData.length > 0) {
                setLoading(true)
                let data = filteredData.find(f => f.name == e.target.textContent)
                document.getElementById(`id_${id}`).value = data.id

                const id_user = document.getElementById(`id_user`).value || ''
                const id_class = document.getElementById('id_class').value || ''
                input.value = data.name
                if (id_user || id_class) {
                    let result = await api.get(`report/recap?id_user=${id_user}&id_class=${id_class}`)
                    if (result.ok) {
                        updateReport(result.data[0])
                    }
                } else {
                    updateReport()
                }
            }
            setLoading(false)
        }
    } else {
        ul.innerHTML = ''
        ul.style.display = 'none'
        document.getElementById(`id_${id}`).value = ''
    }
}, 200)

async function handleSelect(e) {
    const id_user = document.getElementById(`id_user`).value || ''
    const id_class = document.getElementById('id_class').value || ''
    let category = e.target.value
    console.log(category)
    if (id_user || id_class || category) {
        let result = await api.get(`report/recap?id_user=${id_user}&id_class=${id_class}&date=${category}`)
        if (result.ok) {
            updateReport(result.data[0])
        }
    } else {
        updateReport()
    }

    setLoading(false)
}

function initEvent() {
    const search_teacherEl = document.getElementById('teacher')
    const search_clsEl = document.getElementById('cls_name')
    const select_el = document.getElementById('category')
    if (search_teacherEl) search_teacherEl.addEventListener('input', debounced)

    if (search_clsEl) search_clsEl.addEventListener('input', debounced)

    if (select_el) select_el.addEventListener('change', handleSelect)
}

export function renderPageReport(mainContent) {
    document.querySelector('.content-title').innerText = 'Laporan'
    mainContent.innerHTML = `
    <section id="page-major" class="p-4">
    <header class="d-flex justify-content-between align-items-center mb-4">
        <div class="search-wrapper">
            <button type="button" class="btn add-teacher" id="add-major" onclick="window.print()">
                        <i class="fa-solid fa-print"></i>
                    </button>
         </div>
        <div class="header_action d-flex gap-2">
        <div class="flex-1">
         <select class="form-select search-select" id="category" aria-label="select example" data-rules='required'>
                <option selected>Waktu</option>
                <option value="today">Hari Ini</option>
                <option value="week">Minggu Ini</option>
                <option value="month">Bulan Ini</option>
            </select>
        </div>
        
         <div class="flex-1 report-search search-select">
         <input type="hidden" class="form-control" id="id_class" placeholder="Cari Kelas">
         <input type="search" class="form-control" id="cls_name" data-id='class' data-type='classes' placeholder="Cari Kelas..." data-rules='required'>
              <ul class='option-list p-0 border mt-1' id='list-class'></ul>
         </div>
         <div class="flex-1 report-search search-select">
           <input type="hidden" class="form-control" id="id_user">
         <input type="search" class="form-control" id="teacher" data-id='user' data-type='users' placeholder="Cari Guru..." data-rules='required'>
            <ul class='option-list p-0 border mt-1' id='list-user'></ul> 
         </div>
        </div>
            </header>

            <div class="table-responsive">
                <div class="report-header">
                                   </div>
                <table class="table table-custom align-middle" id="table-report">
                    <thead class="table-light">
                        <tr>
                            <th scope="col" class="text-center">No</th>
                            <th scope="col" class="text-center">Tanggal</th>
                            <th scope="col" class="text-center">Jam</th>
                            <th scope="col" class="text-center">Mapel</th>
                            <th scope="col" class="text-center">Guru</th>
                            <th scope="col" class="text-center">Materi</th>
                            <th scope="col" class="text-center">Kehadiran</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </section>
    `

    initEvent()
}


function updateReport(content) {
    const table = document.getElementById('table-report')
    const tbody = document.querySelector('tbody')
    tbody.innerHTML = ''
    if (content.activity.length > 0) {
        content.activity.forEach((act, i) => {
            tbody.innerHTML += `
        <tr>
             <td>${i + 1}</td>
             <td>${act.date}</td>
             <td>${act.time}</td>
             <td>${act.subject}</td>
             <td>${act.teacher}</td>
             <td>${act.lesson}</td>
             <td>${act.persentase}</td>
        </tr>
      `
        })
    }
    console.log(content)

}