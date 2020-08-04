const mysql = require('mysql')

class Pool {
  constructor(config) {
    this.pool = mysql.createPool({
      host   : config.host,
      port   : config.port,
      user   : config.user,
      password : config.password,
      database : config.database,
      charset  : config.charset,
      connectionLimit: config.pool.acquireIncrement
    })
  }

  getConn() {
    let that = this
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (!err) {
          resolve(that._parseConn(connection))
        } else {
          reject(err)
        }
      })
    })
  }

  _parseConn(connection) {
    connection._query = connection.query
    return connection
  }

  getTransactionConn() {
    let that = this
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (!err) {
          connection.beginTransaction(err => {
            if (!err) {
              resolve(that._parseConn(connection))
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
          reject(err)
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

module.exports = Pool
