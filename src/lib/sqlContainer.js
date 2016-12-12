import Rule from './rule'
import path from 'path'
import vm from 'vm'
import fs from 'fs'

const keyReg = /\:([\w\._]+)/g
const ddlKeyReg = /\::([\w\._]+)/g
const childKeyReg = /\{{\s*([\w\._]+)\s*}}/g

export default class {
    constructor(dir) {
        this.container = new Map() 
        let files = fs.readdirSync(dir), rule = null
        for (var file of files) {
            if(file.indexOf('.swp') == -1) {
                rule = new Rule(path.join(dir, file))
                this.container.set(rule.namespace, rule.rawSql)
            }
        }
    }

    get(key, data) {
        let sqlArray = this.getRaw(key)
        let sql = this._parseRawSql(sqlArray, data)
        return this._fillParams(sql, data)
    }

    getRaw(key) {
        let keys = key.split('.'), sql = null 
        if (keys.length < 2) {
            console.error('wrong key, the right key is xxx.xxx')
            return
        }
        let namespace = keys[0]
        let sqlKey = keys.slice(1).join('')
        let sqlMap = this.container.get(namespace)
        if (sqlMap) {
            sql = sqlMap.get(sqlKey)
            if (!sql) {
                console.error('The sql:', key, 'not exists!')
            }
        } else {
            console.error('The namespace:', namespace, 'not exists!')
        }
        return sql
    }

    _parseRawSql(sqlArray, data) {
        let sqls = [], result = '', condSql = ''
        for (let sql of sqlArray) {
            if (typeof sql == 'string') {
                sqls.push(sql)
            } else {
                condSql = this._parseCond(sql, data)
                if (condSql != '') {
                    sqls.push(condSql)
                }
            }
        }
        result = sqls.join(' ')
        result = result.replace('where and', 'where')
        return result
    }

    _parseCond(node, data) {
        let sql = '', statements = ''
        data = data || {}
        const context = new vm.createContext(data) 
        if (node.name.toLowerCase() === 'if') {
            if (node.test && typeof node.test == 'string') {
                statements = node.test.replace(keyReg, (match, key) => {
                    data[key] = data[key] || null
                    return key
                })
                let isTrue = false
                try {
                    isTrue = new vm.Script(statements).runInContext(context)
                } catch (e) {
                    isTrue = false
                }
                if (isTrue) {
                    sql = node.sql
                }
            }
        }
        return sql.trim()
    }

    _fillParams(sql, data) {
        let params = [], that = this
        //fill ::key
        sql = sql.replace(ddlKeyReg, (match, key) => {
            return data[key]
        })
        //fill :key
        sql = sql.replace(keyReg, (match, key) => {
            params.push(data[key])
            return '?'
        })
        //fill {{key}}
        sql = sql.replace(childKeyReg, (match, key) => {
            return that.get(key).sql
        }) 
        return {
            sql: sql,
            params: params.length > 0 ? params : null
        } 
    }
}

