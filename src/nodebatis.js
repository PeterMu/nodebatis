const _ = require('lodash')
const Pool = require('./lib/pool')
const SqlContainer = require('./lib/sqlContainer')
const Models = require('./lib/models')
const Types = require('./types')
const builder = require('./lib/sqlBuilder')

class NodeBatis {

    constructor(dir, config) {
        if (!dir) {
            throw new Error('please set dir!')
        }
        if (!config) {
            throw new Error('please set config!')
        }
        this.dir = dir
        this.debug = config.debug || false
        this.config = config
        this.models = new Models()
        this.pool = new Pool(config, this.models)
        this.sqlContainer = new SqlContainer(dir)
    }

    async execute(key, data, transactionConn) {
        let sqlObj = this.sqlContainer.get(key, data)
        if (this.debug) {
            console.info(key, sqlObj.sql, sqlObj.params || '')
        }
        let result = await this.pool.query(key, sqlObj.sql, sqlObj.params, transactionConn)
        if (this.config.camelCase === true) {
            result = this._camelCase(result)
        }
        return result
    }

    async query(key, data, transactionConn) {
        return await this.execute(key, data, transactionConn)
    }

    async insert(tableName, data, transactionConn) {
        if (tableName && data) {
            if (this.config.camelCase === true) {
                data = this._snakeCase(data)
            }
            let sqlObj = builder.getInsertSql(tableName, data)
            let key = `_auto_builder_insert_${tableName}`
            if (this.debug) {
                console.info(key, sqlObj.sql, sqlObj.params || '')
            }
            return await this.pool.query(key, sqlObj.sql, sqlObj.params, transactionConn)
        } else {
            console.error('insert need tableName and data')
        }
    }

    async update(tableName, data, idKey = 'id', transactionConn) {
        if (tableName && data) {
            if (this.config.camelCase === true) {
                data = this._snakeCase(data)
                idKey = _.snakeCase(idKey)
            }
            let sqlObj = builder.getUpdateSql(tableName, data, idKey)
            let key = `_auto_builder_update_${tableName}`
            if (this.debug) {
                console.info(key, sqlObj.sql, sqlObj.params || '')
            }
            return await this.pool.query(key, sqlObj.sql, sqlObj.params, transactionConn)
        } else {
            console.error('update need tableName and data')
        }
    }

    async del(tableName, id, idKey, transactionConn) {
        if (tableName && id) {
            let sqlObj = builder.getDelSql(tableName, id, idKey)
            let key = `_auto_builder_del_${tableName}`
            if (this.debug) {
                console.info(key, sqlObj.sql, sqlObj.params || '')
            }
            return await this.pool.query(key, sqlObj.sql, sqlObj.params, transactionConn)
        } else {
            console.error('del need tableName and id')
        }
    }

    //use transastion
    async getTransaction() {
        const that = this
        let conn = await this.beginTransaction()
        let nodebatis = {
            conn,
            execute: async (key, data) => {
                return await that.execute(key, data, conn)
            },
            query: async (key, data) => {
                return await that.query(key, data, conn)
            },
            insert: async (tableName, data) => {
                return await that.insert(tableName, data, conn)
            },
            update: async (tableName, data, idKey) => {
                return await that.update(tableName, data, idKey, conn)
            },
            del: async (tableName, id, idKey) => {
                return await that.del(tableName, id, idKey, conn)
            },
            commit: async () => {
                let ret = null
                try {
                    ret = await that.commit(conn)
                } catch (e) {
                    console.error('commit error:', e.stack)
                } finally {
                    that.releaseConn(conn)
                }
                return ret
            },
            rollback: async () => {
                let ret = null
                try {
                    ret = await that.rollback(conn)
                } catch (e) {
                    console.error('rollback error:', e.stack)
                } finally {
                    that.releaseConn(conn)
                }
                return ret
            }
        }
        return nodebatis
    }

    async beginTransaction() {
        let that = this
        let conn = await this.pool.beginTransaction()
        conn.execute = async (key, data) => {
            return await that.execute.apply(that, [key, data, conn])
        }
        return conn
    }

    async commit(conn) {
        return await this.pool.commit(conn)
    }

    async rollback(conn) {
        await this.pool.rollback(conn)
    }

    releaseConn(connection) {
        return this.pool.releaseConn(connection)
    }

    define(key, model) {
        this.models.set(key, model)
    }

    _camelCase(data) {
        if (_.isArray(data)) {
            let array = []
            for (let item of data) {
                let parsedItem = {}
                for (let key in item) {
                    parsedItem[_.camelCase(key)] = item[key]
                }
                array.push(parsedItem)
            }
            return array
        } else {
            let parsedData = {}
            for (let key in data) {
                parsedData[_.camelCase(key)] = data[key]
            }
            return parsedData
        }
    }

    _snakeCase(data) {
        if (_.isArray(data)) {
            let array = []
            for (let item of data) {
                let parsedItem = {}
                for (let key in item) {
                    parsedItem[_.snakeCase(key)] = item[key]
                }
                array.push(parsedItem)
            }
            return array
        } else {
            let parsedData = {}
            for (let key in data) {
                parsedData[_.snakeCase(key)] = data[key]
            }
            return parsedData
        }
    }
}

NodeBatis.Types = Types

module.exports = NodeBatis

