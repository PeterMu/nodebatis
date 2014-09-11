var Session;

Session = (function() {
  function Session(sqlContainer, conn) {
    this._sqlContainer = sqlContainer;
    this._conn = conn;
  }

  Session.prototype.getConnState = function() {
    return this._conn.state;
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
      conds = node.test.split(' and ');
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
          if (param[array[0].trim()] < array[1]) {
            flag = true;
          } else {
            flag = false;
          }
          break;
        case cond.indexOf('>') === -1:
          array = cond.split('>');
          if (param[array[0].trim()] > array[1]) {
            flag = true;
          } else {
            flag = false;
          }
          break;
        case cond.indexOf('!=') === -1:
          array = cond.split('!=');
          if (param[array[0].trim()] !== array[1]) {
            flag = true;
          } else {
            flag = false;
          }
          break;
        case cond.indexOf('==') === -1:
          array = cond.split('==');
          if (param[array[0].trim()] === array[1].trim()) {
            flag = true;
          } else {
            flag = false;
          }
          break;
        default:
          flag = false;
      }
    }
    return flag;
  };

  Session.prototype.escape = function(val) {
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
    return "'" + val + "'";
  };

  Session.prototype._fillParam = function(param) {
    var reg, that;
    that = this;
    if (param) {
      reg = /\:(\w+)/g;
      this.sql = this.rawSQL.replace(reg, function(match, key) {
        return that.escape(param[key]);
      });
    } else {
      this.sql = this.rawSQL;
      return this.sql;
    }
  };

  Session.prototype.release = function() {
    this._conn.release();
    delete this._conn;
  };

  Session.prototype.delete = function(id, param, callback) {
    var sqlArray, that;
    that = this;
    sqlArray = this._sqlContainer.get(id);
    this.rawSQL = this._processRawSQL(sqlArray, param);
    this._fillParam(param);
    this._conn.query(this.sql, function(err, rows) {
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
    that = this;
    sqlArray = this._sqlContainer.get(id);
    this.rawSQL = this._processRawSQL(sqlArray, param);
    this._fillParam(param);
    this._conn.query(this.sql, function(err, rows) {
      if (err) {
        console.log(err);
        callback(err, null)
      } else {
        callback(null, rows)
      }
      that.release();
    });
  };

  Session.prototype.selectOne = function(id, param, callback) {
    var sqlArray, that;
    that = this;
    sqlArray = this._sqlContainer.get(id);
    this.rawSQL = this._processRawSQL(sqlArray, param);
    this._fillParam(param);
    this._conn.query(this.sql, function(err, rows) {
      if (err) {
        console.log(err);
        callback(err, null)
      } else {
        if (rows.length > 0) {
          callback(null, rows[0])
        } else {
          callback('more than one row!', null)
        }
      }
      that.release();
    });
  };

  Session.prototype.insert = function(id, param, callback) {
    var sqlArray, that;
    that = this;
    sqlArray = this._sqlContainer.get(id);
    this.rawSQL = this._processRawSQL(sqlArray, param);
    this._fillParam(param);
    this._conn.query(this.sql, function(err, result) {
      if (err) {
        console.log(err);
        callback(err, null)
      } else {
        callback(null, result.affectedRows)
      }
      that.release();
    });
  };

  Session.prototype.update = function(id, param, callback) {
    var sqlArray, that;
    that = this;
    sqlArray = this._sqlContainer.get(id);
    this.rawSQL = this._processRawSQL(sqlArray, param);
    this._fillParam(param);
    this._conn.query(this.sql, function(err, result) {
      if (err) {
        console.log(err);
        callback(err, null)
      } else {
        callback(null, result.affectedRows)
      }
      that.release();
    });
  };

  Session.prototype.commit = function(callback) {
    this._conn.commit(function(err) {
      if (err) {
        callback(err)
      } else {
        callback(null)
      }
    });
  };

  Session.prototype.rollback = function(callback) {
    this._conn.rollback(function(err) {
      if (err) {
        callback(err)
      } else {
        callback(null)
      }
    });
  };

  Session.prototype.beginTransaction = function(callback) {
    this._conn.beginTransaction(function(err) {
      if (err) {
        callback(null)
      } else {
        callback(null, this)
      }
    });
  };
  return Session
})();

module.exports = Session;

