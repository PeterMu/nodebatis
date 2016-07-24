import MysqlPool from './dialects/mysql/pool'

export default class {
    constructor (config) {
        this.config = Object.assign({
            dialect: 'mysql',
            host: '127.0.0.1',
            port: null,
            user: null 
            password: null 
            minPoolSize: 2,
            maxPoolSize: 20
        }, config)
        if (this.config.dialect == 'mysql') {
            this._pool = new MysqlPool(this.config)
        }
    }

    async getConn() {
        let conn = await this._pool.getConn()
        return conn
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
            throws new Error('the port is null, please set port')
        }
    }

    get user() {
        if (this.config.user) {
            return this.config.user
        } else {
            throws new Error('the user is null, please set user')
        }
    }

    get password() {
        if (this.config.password) {
            return this.config.password
        } else {
            throws new Error('the password is null, please set password')
        }
    }

    get minPoolSize() {
        return this.config.minPoolSize
    }

    get maxPoolSize() {
        return this.config.maxPoolSize
    }
}

