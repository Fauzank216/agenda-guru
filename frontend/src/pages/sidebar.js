import { setLoading } from "../../setLoading.js";
import { api } from "../api.js";
import { states } from "../state.js";

export function renderSidebar() {
    const mainContent = document.querySelector('.main')
    mainContent.insertAdjacentHTML('afterbegin', `<aside class="side-bar">
            <div class="sidebar-header text-center border-bottom m-2">
                 <img src="src/assets/logo.png" alt="" style="width:150px;">
            </div>

            <nav class="sidebar-content mt-3">
                <ul class="list-item">
                 ${
                    states.role == 'admin'?`<li class='admin-menu'>
                        <button class="item item-btn" onclick="navigates('dashboard')">
                            Dashboard
                        </button>
                    </li>`:''
                 }
                 ${
                    states.role == 'admin'?`
                    <li class="admin-menu section-title">Data Master</li>
                    <li class="admin-menu">
                        <button class="item item-btn" onclick="navigates('guru')">Guru</button>
                    </li>
                    <li class="admin-menu">
                        <button class="item item-btn" onclick="navigates('siswa')">Siswa</button>
                    </li>
                    <li class="admin-menu">
                        <button class="item item-btn" onclick="navigates('semester')">Semester</button>
                    </li>
                    <li class="admin-menu">
                        <button class="item item-btn" onclick="navigates('jurusan')">Jurusan</button>
                    </li>
                    <li class="admin-menu">
                        <button class="item item-btn" onclick="navigates('mapel')">Mapel</button>
                    </li>
                    <li class="admin-menu">
                        <button class="item item-btn" onclick="navigates('kelas')">Kelas</button>
                    </li>
                    `:''
                 }   
                    
                    <li class="section-title">Akademik</li>
                    <li>
                        <button class="item item-btn" onclick="navigates('jadwal')">Jadwal</button>
                    </li>
                    <li>
                        <button class="item item-btn" onclick="navigates('agenda')">Agenda
                        </button>
                    </li>
                 ${
                    states.role == 'admin'?`
                    <li class="admin-menu">
                        <button class="item item-btn" onclick="navigates('laporan')"> Laporan</button>
                    </li>
                    `:''
                 }   
                </ul>
            </nav>

            <div class="sidebar-footer pe-0">
                <button class="item logout-btn" onclick="handleLogout()">logout</button>
            </div>
        </aside>
            `)
}