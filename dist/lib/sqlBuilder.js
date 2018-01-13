'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getDelSql = exports.getUpdateSql = exports.getInsertSql = undefined;

var _sqlstring = require('sqlstring');

var getInsertSql = exports.getInsertSql = function getInsertSql(tableName, data) {
    var columns = [],
        params = [],
        holders = [],
        sql = '';
    tableName = (0, _sqlstring.escapeId)(tableName);
    for (var key in data) {
        columns.push((0, _sqlstring.escapeId)(key));
        holders.push('?');
        params.push(data[key]);
    }
    columns = columns.join(',');
    holders = holders.join(',');
    sql = 'insert into ' + tableName + ' (' + columns + ') values (' + holders + ')';
    return { sql: sql, params: params };
}; /**
    * sql 构造
    */

var getUpdateSql = exports.getUpdateSql = function getUpdateSql(tableName, data) {
    var idKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'id';

    var sql = '',
        params = [],
        holders = [];
    var where = '';
    tableName = (0, _sqlstring.escapeId)(tableName);
    idKey = (0, _sqlstring.escapeId)(idKey);
    for (var key in data) {
        if (key != idKey) {
            key = (0, _sqlstring.escapeId)(key);
            holders.push(key + ' = ?');
            params.push(data[key]);
        }
    }
    holders = holders.join(',');
    if (data[idKey]) {
        where = 'where ' + idKey + ' = ?';
        params.push(data[idKey]);
    }
    sql = 'update ' + tableName + ' set ' + holders + ' ' + where;
    return { sql: sql, params: params };
};

var getDelSql = exports.getDelSql = function getDelSql(tableName, id) {
    var idKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'id';

    var sql = 'delete from ' + tableName + ' where ' + idKey + ' = ?';
    tableName = (0, _sqlstring.escapeId)(tableName);
    idKey = (0, _sqlstring.escapeId)(idKey);
    return {
        sql: sql,
        params: [id]
    };
};