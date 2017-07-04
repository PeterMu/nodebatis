/**
 * sql 构造
 */

export const getInsertSql = (tableName, data) => {
    let columns = [], params = [], holders = [], sql = '' 
    for (let key in data) {
        columns.push(key)
        holders.push('?')
        params.push(data[key])
    }
    columns = columns.join(',')
    holders = holders.join(',')
    sql = `insert into ${tableName} (${columns}) values (${holders})`
    return { sql, params }
}

export const getUpdateSql = (tableName, data, idKey = 'id') => {
    let sql = '', params = [], holders = []
    let where = '' 
    for (let key in data) {
        if (key != idKey) {
            holders.push(`${key} = ?`)
            params.push(data[key])
        }
    }
    holders = holders.join(',')
    if (data[idKey]) {
        where = `where ${idKey} = ?`
        params.push(data[idKey])
    }
    sql = `update ${tableName} set ${holders} ${where}`
    return { sql, params }
}

export const getDelSql = (tableName, id, idKey = 'id') => {
    let sql = `delete from ${tableName} where ${idKey} = ?`
    return {
        sql: sql,
        params: [id]
    }
}

