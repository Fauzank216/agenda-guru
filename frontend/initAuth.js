import { states } from "./src/state.js"
import { setLoading } from "./setLoading.js"
import { api } from "./src/api.js"
import { renderSidebar } from "./src/pages/sidebar.js"
export async function initPage() {
    setLoading(true)
    let keys = states.role == 'admin'?['users', 'students',  'semesters', 'majors', 'classes','subjects', 'schedules', 'agendas']:['schedules', 'agendas']
    
    let result = await api.getAll()
    keys.forEach((key, i) => {        
            states.data[key] = result[i].data
    })

    renderSidebar()
    setLoading(false)
}