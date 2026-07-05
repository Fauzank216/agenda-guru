export const states = {
    currentPage: '',
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    token: localStorage.getItem('token') || '',
    role: localStorage.getItem('role') || '',
    initiated: false,
    isLoading: false,
    id_class_detail: '',
    id_agenda_detail: '',
    id_class: '',
    search_keyword: '',
    action: '',
    data: {
        "users": [],
        "students": [],
        "semesters": [],
        "majors": [],
        "subjects": [],
        "classes": [],
        "members": [],
        "schedules": [],
        "agendas": [],
        "agenda_detail": [],
    }
}

export function showAlert(success, message = null) {
    let alertEl;

    if (success) {
        alertEl = document.querySelector('.alert-primary')
    } else {
        alertEl = document.querySelector('.alert-danger')
    }

    alertEl.style.display = 'block'
    setTimeout(() => {
        alertEl.style.display = 'none'
    }, 3000)
}