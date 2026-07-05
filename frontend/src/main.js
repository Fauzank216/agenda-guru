import { renderLogin } from "./pages/login.js"
import { initPage } from "../initAuth.js"
import { pages } from "./route.js"
import { states } from "./state.js"

export async function render() {
    if (!states.isLoggedIn) {
        return renderLogin()
    }

    if (!states.initiated) {
        states.initiated = true
        document.querySelector('.main').innerHTML = `
        <main class="main-content">
            <nav class="navbar main-navbar">
                <div class="container-fluid">
                    <i class="fa-solid fa-bars menu-toggle"></i>
                    <h1 class="content-title"></h1>
                    <i class="fa-solid fa-circle-user" id="nav-profile" data-bs-toggle="modal" data-bs-target="#modal-profile"></i>
                </div>
            </nav>

            <div id="app"></div>
        </main>
        `
        await initPage()
        console.log('pindah')
    }

    const app = document.getElementById('app')
    pages[states.currentPage](app)
}

window.navigates = function (pages) {
       if (pages !== states.currentPage) {
        states.currentPage = pages || 'dashboard'
        render()
    }
}

window.navigates()