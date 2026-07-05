import { states } from "./state.js"

const BASE_URL = 'http://localhost:3000/api'

async function fetchWrapper(endpoint, method, data) {
    let request = {
        method,
        headers: {
            'authorization': `Bearer ${states.token}`,
            'Content-Type': 'application/json'
        }
    }

    if (method === 'POST' || method === 'PUT' || method === 'PATCH' && data !== null) {
        request.body = JSON.stringify(data)
    }
    let result = await fetch(`${BASE_URL}/${endpoint}`, request)
    let json = await result.json()

    return {
        ok: result.ok,
        status: result.status,
        token: json.token || '',
        data: json.data
    }
}

export const api = {
    async getAll() {
        let result;
        if(states.role == 'admin'){
            result = await Promise.all([
                fetchWrapper('users', 'GET', null),
                fetchWrapper('students', 'GET', null),
                fetchWrapper('semesters', 'GET', null),
                fetchWrapper('majors', 'GET', null),
                fetchWrapper('classes', 'GET', null),
                fetchWrapper('subjects', 'GET', null),
                fetchWrapper('schedules', 'GET', null),
                fetchWrapper('agendas', 'GET', null),
            ])
        }else if(states.role == 'teacher'){
            result = await Promise.all([
                fetchWrapper('schedules', 'GET', null),
                fetchWrapper('agendas', 'GET', null),
            ])
            console.log(result)
        }
        return result
    },
    async get(endpoint) {
        let result = await fetchWrapper(endpoint, 'GET', null)
        return result
    },
    async post(endpoint, data) {
        let result = await fetchWrapper(endpoint, 'POST', data)
        return result
    },
    async patch(endpoint, data) {
        let result = await fetchWrapper(endpoint, 'PATCH', data)
        return result
    },
    async put(endpoint, data) {
        let result = await fetchWrapper(endpoint, 'PUT', data)
        return result
    },
    async delete(endpoint) {
        let result = await fetchWrapper(endpoint, 'DELETE', null)
        return result
    },
}
