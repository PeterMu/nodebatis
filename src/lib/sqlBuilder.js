/**
 *  sql builder
 */

const { escapeId } = require('sqlstring')

exports.getInsertSql = (tableName, data) => {
    let columns = [], params = [], holders = [], sql = ''
    tableName = escapeId(tableName)
    for (let key in data) {
        columns.push(escapeId(key))
        holders.push('?')
        params.push(data[key])
    }
    columns = columns.join(',')
    holders = holders.join(',')
    sql = `insert into ${tableName} (${columns}) values (${holders})`
    return { sql, params }
}

exports.getUpdateSql = (tableName, data, idKey = 'id') => {
    let sql = '', params = [], holders = []
    let where = ''
    tableName = escapeId(tableName)
    for (let key in data) {
        if (key != idKey) {
            holders.push(`${escapeId(key)} = ?`)
            params.push(data[key])
        }
    }
    holders = holders.join(',')
    if (data[idKey]) {
        where = `where ${escapeId(idKey)} = ?`
        params.push(data[idKey])
    }
    sql = `update ${tableName} set ${holders} ${where}`
    return { sql, params }
}

exports.getDelSql = (tableName, id, idKey = 'id') => {
    tableName = escapeId(tableName)
    idKey = escapeId(idKey)
    let sql = `delete from ${tableName} where ${idKey} = ?`
    return {
        sql: sql,
        params: [id]
    }
}

