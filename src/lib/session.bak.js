var Session;

Session = (function() {
  function Session(sqlContainer, conn, done) {
    this._sqlContainer = sqlContainer;
    this._conn = conn;
    this._done = done;
  }

  Session.prototype.getConnState = function() {
    return this._conn.state;
  };

  Session.prototype.resetConn = function(conn, done) {
    this._conn = conn;
    this._done = done;
  };

  Session.prototype._processRawSQL = function(sqlArray, param) {
    var array, obj, _i, _len;
    array = [];
    for (_i = 0, _len = sqlArray.length; _i < _len; _i++) {
      obj = sqlArray[_i];
      if (typeof obj === 'string') {
        array.push(obj);
      }
      if (obj instanceof Object) {
        array.push(this._processConds(obj, param));
      }
    }
    return array.join(' ');
  };

  Session.prototype._processConds = function(node, param) {
    var cond, conds, flag, _i, _len;
    if (node.name === 'if') {
      flag = true;
      conds = node.test && node.test.split(' and ');
      conds = conds || []
      for (_i = 0, _len = conds.length; _i < _len; _i++) {
        cond = conds[_i];
        if (this._parseCond(cond, param)) {
          continue;
        } else {
          flag = false;
          break;
        }
      }
      if (flag) {
        return node.sql.trim();
      } else {
        return '';
      }
    } else {
      return '';
    }
  };

  Session.prototype._parseCond = function(cond, param) {
    var array, flag;
    flag = false;
    if (param) {
      switch (false) {
        case cond.indexOf('<') === -1:
          array = cond.split('<');
          if (param[array[0].trim()] < array[1].trim()) {
            flag = true;
          } else {
            flag = false;
          }
          break;
        case cond.indexOf('>') === -1:
          array = cond.split('>');
          if (param[array[0].trim()] > array[1].trim()) {
            flag = true;
          } else {
            flag = false;
          }
          break;
        case cond.indexOf('!=') === -1:
          array = cond.split('!=');
          if(array[1].trim() == 'null'){
            array[1] = null
          }
          if (param[array[0].trim()] !== (array[1] ? array[1].trim() : array[1])) {
            flag = true;
          } else {
            flag = false;
          }
          break;
        case cond.indexOf('==') === -1:
          array = cond.split('==');
          if(array[1].trim() == 'null'){
            array[1] = null
          }
          if (param[array[0].trim()] === (array[1] ? array[1].trim() : array[1])) {
            flag = true;
          } else {
            flag = false;
          }
          break;
        default:
          flag = !!param[cond.trim()]
      }
    }
    return flag;
  };

  Session.prototype.escape = function(val, type) {
    type = type || 'default';
    if (val === void 0 || val === null) {
      return 'NULL';
    }
    switch (typeof val) {
      case 'boolean':
        if (val) {
          val = 'true';
        } else {
          val = 'false';
        }
        return val;
      case 'number':
        return val + '';
    }
    val = val.replace(/[\0\n\r\b\t\\\'\"\x1a]/g, function(s) {
      switch (s) {
        case '\0':
          return '\\0';
        case '\n':
          return '\\n';
        case '\r':
          return '\\r';
        case '\b':
          return '\\b';
        case '\t':
          return '\\t';
        case '\x1a':
          return '\\x1a';
        default:
          return '\\' + s;
      }
    });
    if(type == 'default'){
        return "'" + val + "'";
    }else{
        return val
    }
  };

  Session.prototype._fillParam = function(param) {
    var reg, that, index = 0;
    that = this;
    this.params = []
    if (param) {
      reg = /\:(\w+)/g;
      this.sql = this.rawSQL.replace(reg, function(match, key) {
        //使用postgresql的参数化sql
        index++
        that.params.push(param[key])
        return '$'+index
      });
      this.beautySQL = this.rawSQL.replace(reg, function(match, key) {
        return param[key];
      });
      //#开头的不会进行任何转义,用于DDL
      reg = /\#(\w+)/g;
      this.sql = this.sql.replace(reg, function(match, key) {
        return param[key];
      });
    } else {
      this.sql = this.rawSQL;
      this.beautySQL = this.sql
    }
  };

  Session.prototype.release = function() {
    //释放数据库连接，释放后连接放回连接池
    this._done();
  };

  Session.prototype.destroy = function() {
    this._conn.end()
  }
  
  Session.prototype.emptyFn = function(){}

  Session.prototype.del = function(id, param, callback) {
    var sqlArray, that;
    callback || (callback = Session.emptyFn)
    if(arguments.length == 2){
        callback = param
        param = null
    }
    that = this;
    sqlArray = this._sqlContainer.get(id);
    if(!sqlArray) return
    this.rawSQL = this._processRawSQL(sqlArray, param);
    this._fillParam(param);
    this._conn.query(this.sql, this.params, function(err, rows) {
      if (err) {
        console.log(err);
        callback(err, null)
      } else {
        callback(null, rows)
      }
      that.release();
    });
  };
  Session.prototype.select = function(id, param, callback) {
    var sqlArray, that;
    callback || (callback = Session.emptyFn)
    if(arguments.length == 2){
        callback = param
        param = null
    }
    that = this;
    sqlArray = this._sqlContainer.get(id);
    if(!sqlArray) return
    this.rawSQL = this._processRawSQL(sqlArray, param);
    this._fillParam(param);
    this._conn.query(this.sql, this.params, function(err, result) {
      if (err) {
        console.log(err);
        callback(err, null)
      } else {
        callback(null, result.rows)
      }
      that.release();
    });
  };

  Session.prototype.selectOne = function(id, param, callback) {
    var sqlArray, that;
    callback || (callback = Session.emptyFn)
    if(arguments.length == 2){
        callback = param
        param = null
    }
    that = this;
    sqlArray = this._sqlContainer.get(id);
    if(!sqlArray) return
    this.rawSQL = this._processRawSQL(sqlArray, param);
    this._fillParam(param);
    this._conn.query(this.sql, this.params, function(err, result) {
      if (err) {
        console.log(err);
        callback(err, null)
      } else {
        if (rows.length > 0) {
          callback(null, result.rows[0])
        } else {
          callback('more than one row!', null)
        }
      }
      that.release();
    });
  };

  Session.prototype.insert = function(id, param, callback) {
    var sqlArray, that;
    callback || (callback = Session.emptyFn)
    if(arguments.length == 2){
        callback = param
        param = null
    }
    that = this;
    sqlArray = this._sqlContainer.get(id);
    if(!sqlArray) return
    this.rawSQL = this._processRawSQL(sqlArray, param);
    this._fillParam(param);
    this._conn.query(this.sql, this.params, function(err, result) {
      if (err) {
        console.log(err);
        callback(err, null)
      } else {
        callback(null, result.rowCount)
      }
      that.release();
    });
  };

  Session.prototype.update = function(id, param, callback) {
    callback || (callback = Session.emptyFn)
    var sqlArray, that;
    if(arguments.length == 2){
        callback = param
        param = null
    }
    that = this;
    sqlArray = this._sqlContainer.get(id);
    if(!sqlArray) return
    this.rawSQL = this._processRawSQL(sqlArray, param);
    this._fillParam(param);
    this._conn.query(this.sql, this.params, function(err, result) {
      if (err) {
        console.log(err);
        callback(err, null)
      } else {
        callback(null, result.rowCount)
      }
      that.release();
    });
  };

  Session.prototype.commit = function() {
    this._conn.query('COMMIT', this._done);
  };

  Session.prototype.rollback = function(callback) {
    var that = this
    var cb = callback || function(){}    
    this._conn.query('ROLLBACK', function(err) {
      if (err) {
        cb(err)
      } else {
        cb(null)
      }
      return that._done(err)
    });
  };

  Session.prototype.beginTransaction = function(callback) {
    var that = this
    this._conn.query('BEGIN', function(err) {
      if (err) {
        Session.prototype.rollback.call(that, callback)
      } else {
        callback(null, that)
      }
    });
  };
  return Session
})();

module.exports = Session;

