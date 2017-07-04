'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * sql 构造
 */

var getInsertSql = exports.getInsertSql = function getInsertSql(tableName, data) {
    var columns = [],
        params = [],
        holders = [],
        sql = '';
    for (var key in data) {
        columns.push(key);
        holders.push('?');
        params.push(data[key]);
    }
    columns = columns.join(',');
    holders = holders.join(',');
    sql = 'insert into ' + tableName + ' (' + columns + ') values (' + holders + ')';
    return { sql: sql, params: params };
};

var getUpdateSql = exports.getUpdateSql = function getUpdateSql(tableName, data) {
    var idKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'id';

    var sql = '',
        params = [],
        holders = [];
    var where = '';
    for (var key in data) {
        if (key != idKey) {
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
    return {
        sql: sql,
        params: [id]
    };
};