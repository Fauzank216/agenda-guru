import { runQuery } from "./tryCatch.wrapper.js"
export async function filterWrapper(query, filter, filterMapping) {
    let conditions = []
    let values = []

    Object.keys(filterMapping).forEach(key => {
        if (key in filter) {
            conditions.push(filter[key])
            values.push(filterMapping[key])
        } else {
            throw Error(`${key}, tidak cocok`)
        }
    })

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ')
    }

    let result = await runQuery(query, values)
    return result
}