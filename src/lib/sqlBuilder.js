/**
 *  sql builder
 */

const { escapeId } = require('sqlstring')
const _ = require('lodash')
const ops = {
  '$eq': '=',
  '$neq': '<>',
  '$lt': '<',
  '$lte': '<=',
  '$gt': '>',
  '$gte': '>=',
  '$like': 'like',
  '$in': 'in'
}

exports.getInsertSql = (tableName, data) => {
  if (!tableName || !data) {
    throw new Error('tableName or data is null')
  }
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

exports.getUpdateSql = (tableName, data, query) => {
  if (!tableName || !data) {
    throw new Error('tableName or data is null')
  }
  let sql = '', params = [], holders = []
  let where = ''
  tableName = escapeId(tableName)
  for (let key in data) {
    holders.push(`${escapeId(key)} = ?`)
    params.push(data[key])
  }
  holders = holders.join(',')
  if (query) {
    let dataSql = getSqlFromObject(query)
    where = `where ${dataSql.sql.join(' and ')}`
    params = params.concat(dataSql.params)
  }
  sql = `update ${tableName} set ${holders} ${where}`
  return { sql, params }
}

exports.getDelSql = (tableName, id, idKey = 'id') => {
  if (!tableName) {
    throw new Error('tableName is null')
  }
  tableName = escapeId(tableName)
  if (idKey) {
    idKey = escapeId(idKey)
    let sql = `delete from ${tableName} where ${idKey} = ?`
    return {
      sql: sql,
      params: [id]
    }
  } else {
    let sql = `delete from ${tableName}`
    return {
      sql: sql,
      params: []
    }
  }
}

const getSqlFromObject = data => {
  let sql = [], params = []
  for (let key in data) {
    if (!_.isObject(data[key])) {
      sql.push(`${escapeId(key)} = ?`)
      params.push(data[key])
    } else {
      let opKey = _.find(_.keys(data[key]), s => s.indexOf('$') === 0)
      if (opKey && ops[opKey]) {
        if (opKey === '$in') {
          let holders = data[key][opKey].map(o => '?')
          sql.push(`${escapeId(key)} ${ops[opKey]} (${holders.join(',')})`)
          for (let item of data[key][opKey]) {
            params.push(item)
          }
        } else {
          sql.push(`${escapeId(key)} ${ops[opKey]} ?`)
          params.push(data[key][opKey])
        }
      }
    }
  }
  return { sql, params }
}

exports.getSelectSql = (tableName, data, start, limit, orderBy, sort) => {
  let sql = [], params = [], holders = []
  let where = ''

  tableName = escapeId(tableName)
  sql.push(`select * from ${tableName}`)

  if (data) {
    where = 'where'
    let dataSql = getSqlFromObject(data)
    holders = holders.concat(dataSql.sql)
    params = params.concat(dataSql.params)
  }
  holders = holders.join(' and ')
  if (holders !== '') {
    holders = [holders]
  } else {
    holders = []
  }

  if (orderBy) {
    holders.push('order by ?')
    params.push(orderBy)
  }
  if (sort) {
    holders.push('?')
    params.push(sort)
  }

  if (/\d/.test(limit)) {
    holders.push('limit ?')
    params.push(limit)
    if (/\d/.test(start)) {
      holders.push('offset ?')
      params.push(start)
    }
  }

  if (where !== '') {
    sql.push(where)
  }
  if (holders.length > 0) {
    sql.push(holders.join(' '))
  }

  return { sql: sql.join(' '), params }
}

exports.getCountSql = (tableName, data) => {
  let sql = [], params = [], holders = []
  let where = ''

  tableName = escapeId(tableName)
  sql.push(`select count(*) count from ${tableName}`)

  if (data) {
    where = 'where'
    let dataSql = getSqlFromObject(data)
    holders = holders.concat(dataSql.sql)
    params = params.concat(dataSql.params)
  }
  holders = holders.join(' and ')

  if (where !== '') {
    sql.push(where)
  }
  if (holders !== '') {
    sql.push(holders)
  }

  return { sql: sql.join(' '), params }
}
