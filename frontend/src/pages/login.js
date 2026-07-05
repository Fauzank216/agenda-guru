import { setLoading } from "../../setLoading.js"
import { api } from "../api.js"
import { render } from "../main.js"
import { states } from "../state.js"

async function handleLogin() {
    setLoading(true)
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    if (email && password) {
        let result = await api.post('auth/login', { email, password })
        if (result.ok) {
            localStorage.setItem('token', result.token)
            localStorage.setItem('role', result.data.role)
            localStorage.setItem('isLoggedIn', 'true')
            states.role = result.data.role
            states.token = result.token
            states.isLoggedIn = true
            window.navigates()
        }
    }

    setLoading(false)
}

window.handleLogout = async function() {
    setLoading(true)
    localStorage.clear('token')
    localStorage.clear('role')
    localStorage.clear('isLoggedIn')
    states.role = ''
    states.token = ''
    states.isLoggedIn = false
    states.currentPage = 'login'
    renderLogin()
     window.location.reload()
    setLoading(false)

}

function initEvent() {
    document.getElementById('btn-login').addEventListener('click', handleLogin)
    console.log(states.isLoggedIn)
}

export function renderLogin() {
    document.querySelector('.main').innerHTML = `
    <div class="login-section container">
        <div class="login-wrapper container p-4">
            <h1 class="text-center fw-normal fs-2">E-agenda</h1>
            <p class="text-center">Lorem ipsum dolor sit amet.</p>
            <form>
                <div class="mb-3">
                    <label for="email" class="form-label">Email address</label>
                    <input type="email" class="form-control" id="email" aria-describedby="emailHelp"
                        placeholder="Masukan Email">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password">
                </div>
                <button type="button" class="btn mt-3 w-100" id="btn-login">LOGIN</button>
            </form>
        </div>
    </div>`

    initEvent()
}



