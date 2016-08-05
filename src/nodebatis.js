import 'babel-polyfill'
import Pool from './lib/pool'
import SqlContainer from './lib/sqlContainer'
import Models from './lib/models'
import Types from './types'

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
        this.models = new Models()
        this.pool = new Pool(config, this.models)
        this.sqlContainer = new SqlContainer(dir)
    }

    async execute(key, data, transationConn) {
        let sqlObj = this.sqlContainer.get(key, data)
        if (this.debug) {
            console.info(key, sqlObj.sql, sqlObj.params || '')
        }
        let result = await this.pool.query(key, sqlObj.sql, sqlObj.params, transationConn)
        return result
    }

    async beginTransation() {
        let that = this
        let conn = await this.pool.beginTransation()
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
}

NodeBatis.Types = Types

export default NodeBatis

