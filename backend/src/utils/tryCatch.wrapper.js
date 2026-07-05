import { connection } from "../../config/db/config.db.js"

export const tryCatchWrapper = function(fn) {
    return async function(req, res, next) {
        try{
            await fn(req, res)
        }catch(err){
            next(err)
        }
    }
}

export const runQuery = async function(query, payload) {
    let main = null
    try{
        main = await connection()
        let [QueryResult] = await main.query(query, payload)
        return QueryResult
    }finally{
        if(main !== null){
           await main.end()
        }
    }
}

