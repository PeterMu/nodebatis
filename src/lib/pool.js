const MysqlPool = require('./dialects/mysql/pool')

class Pool {
    constructor (config, models) {
        this.config = Object.assign({
            dialect: 'mysql',
            host: '127.0.0.1',
            port: null,
            database: null,
            user: null,
            password: null,
            charset: 'utf8',
            camelCase: false,
            pool: {
                minSize: 5,
                maxSize: 20,
                acquireIncrement: 5
            }
        }, config)
        this.models = models
        if (this.config.dialect == 'mysql') {
            this._pool = new MysqlPool(this.config)
        }
    }

    async getConn() {
        let conn = await this._pool.getConn()
        return conn
    }

    async releaseConn(conn) {
        conn.release()
    }

    async query(key, sql, params, transactionConn) {
        let that = this
        try {
            params = params || []
            let conn = transactionConn || await this.getConn()
            let that = this
            return new Promise((resolve, reject) => {
                conn._query(sql, params, (err, results) => {
                    if (!err) {
                        let errors = that.models.validate(key, results)
                        if (errors) {
                            reject(errors)
                        } else {
                            resolve(results)
                        }
                    } else {
                        reject(err)
                    }
                    if (!transactionConn) {
                        that.releaseConn(conn)
                    }
                })
            })
        } catch(e) {
            console.error(e.stack)
            throw new Error(e)
        }
    }

    async beginTransaction() {
        let conn = await this._pool.getTransactionConn()
        return conn
    }

    async commit(conn) {
        return await this._pool.commit(conn)
    }

    async rollback(conn) {
        await this._pool.rollback(conn)
    }

    get dialect() {
        return this.config.dialect
    }

    get host() {
        return this.config.host
    }

    get port() {
        if (this.config.port) {
            return this.config.port
        } else {
            throw new Error('the port is null, please set port')
        }
    }

    get user() {
        if (this.config.user) {
            return this.config.user
        } else {
            throw new Error('the user is null, please set user')
        }
    }

    get password() {
        if (this.config.password) {
            return this.config.password
        } else {
            throw new Error('the password is null, please set password')
        }
    }

    getPool() {
        return this.config.pool
    }
}

module.exports = Pool

