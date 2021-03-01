const Rule = require('./rule')
const path = require('path')
const vm = require('vm')
const fs = require('fs')
const _ = require('lodash')

const keyReg = /\:([\w\._]+)/g
const ddlKeyReg = /\::([\w\._]+)/g
const childKeyReg = /\{{\s*([\w\._]+)\s*}}/g

class SqlContainer {
  constructor(dir) {
    this.container = new Map()
    let files = fs.readdirSync(dir), rule = null
    for (let file of files) {
      let temp = file.toLowerCase()
      if(temp.indexOf('.yml') !== -1 || temp.indexOf('.yaml') !== -1) {
        rule = new Rule(path.join(dir, file))
        this.container.set(rule.namespace, rule.rawSql)
      }
    }
  }

  get(key, data) {
    let sqlArray = this.getRaw(key, data)
    return this._parseRawSql(sqlArray, data)
  }

  getRaw(key, data) {
    let keys = key.split('.'), sql = null
    if (keys.length < 2) {
      throw new Error('wrong key, the right key is xxx.xxx')
    }
    let namespace = keys[0]
    let sqlKey = keys.slice(1).join('')
    let sqlMap = this.container.get(namespace)
    if (sqlMap) {
      sql = sqlMap.get(sqlKey)
      if (!sql) {
        throw new Error('The sql: ' + key + ' not exists!')
      } else {
        //fill {{key}}
        for (let i = 0; i < sql.length; i++) {
          let tempSql = new Map()
          if (typeof sql[i] == 'string') {
            sql[i] = sql[i].replace(childKeyReg, (match, key) => {
              let index = `___${tempSql.size}`
              tempSql.set(key, this.getRaw(key))
              return match
            })
          }
          if (tempSql.size > 0) {
            let tempArray = sql[i].split(childKeyReg)
            for (let [key, value] of tempSql) {
              for (let s=0; s < tempArray.length; s++) {
                if (key === tempArray[s]) {
                  tempArray[s] = value
                }
              }
            }
            sql[i] = tempArray
          }
        }
      }
    } else {
      throw new Error('The namespace: ' + namespace + ' not exists!')
    }
    // 格式化 sql 数组
    return _.filter(_.flattenDeep(sql), s => s !== '')
  }

  _parseRawSql(sqlArray, data) {
    let sqls = [], result = '', condSql = ''
    let rawSql = [], params = []
    for (let sql of sqlArray) {
      if (sql === '') continue;
      if (typeof sql === 'string') {
        sqls.push(this._fillParams(sql, data))
      } else {
        // 只判断 test ，验证通过后拼接 sql，但是参数填充统一在后面处理
        condSql = this._parseCond(sql, data)
        if (condSql) {
          sqls.push(condSql)
        }
      }
    }
    //combine sql and params
    for (let item of sqls) {
      rawSql.push(item.sql)
      if (item.params) {
        params = params.concat(item.params)
      }
    }
    result = rawSql.join(' ')
    let lastWhereReg = /\s+where\s*$/i
    let whereAndReg = /\s+where\s+and\s+/ig
    let whereOtherReg = /\s+where\s+(union\s+|order\s+|group\s+|limit\s+)/gi
    result = result.replace(lastWhereReg, '')
    result = result.replace(whereAndReg, ' where ')
    result = result.replace(whereOtherReg, (match) => {
      return match.replace(/\s+where\s+/i, ' ')
    })
    return {
      sql: result,
      params
    }
  }

  _parseCond(node, data) {
    let sql = null, statements = ''
    data = data || {}
    const context = new vm.createContext(data)
    if (node.name.toLowerCase() === 'if') {
      if (node.test && typeof node.test == 'string') {
        statements = node.test.replace(keyReg, (match, key) => {
          if (data[key] === undefined || data[key] === "") {
            data[key] = null;
          }
          return key
        })
        let isTrue = false
        try {
          isTrue = new vm.Script(statements).runInContext(context)
        } catch (e) {
          isTrue = false
        }
        if (isTrue) {
          sql = this._fillParams(node.sql, data)
        }
      }
    }
    if (node.name.toLowerCase() === 'for') {
      let arrayKey = node.array.replace(':', '')
      if (node.array && data[arrayKey] && data[arrayKey].length > 0) {
        let sqlArray = [], rawSql = [], params = []
        for (let item of data[arrayKey]) {
          sqlArray.push(this._fillParams(node.sql, item))
        }
        for (let item of sqlArray) {
          rawSql.push(item.sql)
          params = params.concat(item.params)
        }
        sql = {
          sql: rawSql.join(node.seperator),
          params
        }
      }
    }
    return sql
  }

  _fillParams(sql, data) {
    let params = [], that = this
    //fill ::key
    sql = sql.replace(ddlKeyReg, (match, key) => {
      return data[key]
    })
    //fill :key
    sql = sql.replace(keyReg, (match, key) => {
      if (key === '_') {
        params.push(data)
      } else {
        params.push(data[key])
      }
      return '?'
    })
    return {
      sql: sql,
      params: params.length > 0 ? params : null
    }
  }
}

module.exports = SqlContainer

