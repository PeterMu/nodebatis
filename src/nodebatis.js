import 'babel-polyfill'
import Pool from './lib/pool'
import SqlContainer from './lib/sqlContainer'

export default class {
    constructor(dir, config) {
        if (!dir) {
            throw new Error('please set dir!')
        }
        if (!config) {
            throw new Error('please set config!')
        }
        this.dir = dir
        this.debug = config.debug || false
        this.pool = new Pool(config)
        this.sqlContainer = new SqlContainer(dir)
    }

    async query(key, data) {
        let sqlObj = this.sqlContainer.get(key, data)
        if (this.debug) {
            console.info(key, sqlObj.sql)
        }
        let result = await this.pool.query(sqlObj.sql, sqlObj.params)
        return result
    }

    async beginTransation() {
        return await this.pool.getTransationConn()
    }

    async commit(conn) {
        return await this.pool.commit(conn)
    }

    async rollback(conn) {
        await this.pool.rollback(conn)
    }

    async releaseConn(connection) {
        return await this.pool.releaseConn(connection)
    }
}

