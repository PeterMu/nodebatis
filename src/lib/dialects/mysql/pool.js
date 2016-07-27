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
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (!err) {
                    resolve(connection)
                } else {
                    reject(err)
                }
            })
        })
    }

    getTransationConn() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (!err) {
                    connection.beginTransaction(err => {
                        if (!err) {
                            resolve(connection)
                        } else {
                            reject(err)
                        }
                    })
                } else {
                    reject(err)
                }
            })
        })
    }

    commit(connection) {
        return new Promise((resolve, reject) => {
            connection.commit(err => {
                if (!err) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
    }

    rollback(connection) {
        return new Promise((resolve, reject) => {
            connection.rollback(() => {
                resolve(true)
            })
        })
    }

    release(connection) {
        connection.release()
    }
}

