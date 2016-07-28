import MysqlPool from './dialects/mysql/pool'

export default class {
    constructor (config, models) {
        this.config = Object.assign({
            dialect: 'mysql',
            host: '127.0.0.1',
            port: null,
            database: null,
            user: null,
            password: null, 
            minPoolSize: 2,
            maxPoolSize: 20
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

    async query(key, sql, params) {
        var that = this
        try {
            params = params || []
            let conn = await this.getConn()
            let that = this
            return new Promise((resolve, reject) => {
                conn.query(sql, params, (err, results) => {
                    if (!err) {
                        resolve(results)
                        console.log(that.models.get(key))
                    } else {
                        reject(err)
                    }
                    that.releaseConn(conn)
                })
            })
        } catch(e) {
            console.error(e)
            throw new Error(e)
        }
    }

    async beginTransation() {
        let conn = await this._pool.getTransationConn()
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

    get minPoolSize() {
        return this.config.minPoolSize
    }

    get maxPoolSize() {
        return this.config.maxPoolSize
    }
}

