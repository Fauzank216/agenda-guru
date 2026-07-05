export class UserModel {
    #runQuery;
    constructor(runQuery) {
        this.#runQuery = runQuery
    }

    async create({nip, name, email, hashedPassword, avatar }) {
        const query = 'INSERT INTO t_users(nip, name, email, password, avatar) VALUES(?, ?, ?, ?, ?)'
        let result = await this.#runQuery(query, [nip, name, email, hashedPassword, avatar])
        return result.insertId
    }

    async findAll(filters) {
        let query = 'SELECT * FROM t_users WHERE role != "admin"'
        const allowedKeys = { 'name': 'name LIKE ?', 'email': 'email LIKE ?' }
        let values = []
        let conditions = []
        console.log(filters)
        Object.keys(filters).forEach(key => {
            if (key in allowedKeys) {
                if (key === 'name' || key === 'email') {
                    values.push(`%${filters[key]}%`)
                } else {
                    values.push(filters[key])
                }
                conditions.push(allowedKeys[key])
            }
        })

        if (conditions.length > 0) {
            query += ' WHERE role = "teacher" AND ' + conditions.join(' AND ')
        }

        let result = await this.#runQuery(query, values)
        return result
    }

    async update({ id_user, name, email, nip }) {
        const query = 'UPDATE t_users SET name = ?, email = ?, nip = ? WHERE id = ? '
        let result = await this.#runQuery(query, [name, email, nip, id_user])
        return result.affectedRows
    }

    async delete(id_user) {
        const query = 'DELETE FROM t_users WHERE id = ?'
        let result = await this.#runQuery(query, [id_user])
        return result.affectedRows
    }

    async updatePassword({ id_user, hashedPassword }) {
        const query = 'UPDATE t_users SET password = ? WHERE id = ?'
        let result = await this.#runQuery(query, [hashedPassword, id_user])
        return result.affectedRows
    }

    async updateAvatar({ id_user, avatar }) {
        const query = 'UPDATE t_users SET avatar = ? WHERE id = ?'
        let result = await this.#runQuery(query, [avatar, id_user])
        return result.affectedRows
    }

    async findById(id_user) {
        const query = 'SELECT * FROM t_users WHERE id = ?'
        let result = await this.#runQuery(query, [id_user])
        return result
    }

    async findByEmail(email) {
        const query = 'Select * FROM t_users WHERE email = ?'
        let result = await this.#runQuery(query, [email])
        return result
    }

    async findByName(name) {
        const query = 'SELECT * FROM t_users WHERE name LIKE ?'
        let result = await this.#runQuery(query, [`%${name}%`])
        return result
    }

    async findByNip(nip){
        const query = `SELECT nip FROM t_users WHERE nip = ?`
        let result = await this.#runQuery(query, [nip])
        return result
    }
    
    async findUserInSchedule(id_user){
        const query = `SELECT * FROM t_schedules WHERE t_schedules.id_user = ?`
        let result = await this.#runQuery(query, [id_user])
        return result
    }
    
    async findUserInAgenda(id_user){
        const query = `SELECT * FROM t_agendas WHERE t_agendas.id_user = ? LIMIT 1`
        let result = await this.#runQuery(query, [id_user])
        return result
    }
}