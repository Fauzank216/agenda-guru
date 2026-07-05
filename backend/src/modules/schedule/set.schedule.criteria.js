export const setScheduleCriteria = async (req, res, next) => {
    let { id, role } = req.user
    let currentSemester = 1
    const allowedQuery = ['id_semester', 'id_class', 'day', 'time', 'id_user']

    req.criteria = {}
    if (role == 'admin') {
        if (!req.query.id_semester) {
            req.criteria.id_semester = currentSemester
        }
    } else if (role == 'teacher') {
        req.criteria.id_semester = currentSemester
        req.criteria.id_user = id
    }

    allowedQuery.forEach(key => {
        if (req.query[key] && !req.criteria[key]) {
            req.criteria[key] = req.query[key]
        }
    })

    next()
}