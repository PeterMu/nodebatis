import mysql from 'mysql'

export default class {
    constructor(config) {
        this.pool = mysql.createPool({
            host     : config.host,
            user     : config.user,
            password : config.password,
            database : config.database,
            connectionLimit: config.maxPoolSize
        })
    }

    getConn() {
        return Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (!err) {
                    resolve(connection)
                } else {
                    reject(err)
                }
            })
        })
    }

    release(connection) {
        connection.release()
    }
}

