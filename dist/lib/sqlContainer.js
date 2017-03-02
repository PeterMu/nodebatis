'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rule = require('./rule');

var _rule2 = _interopRequireDefault(_rule);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _vm = require('vm');

var _vm2 = _interopRequireDefault(_vm);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var keyReg = /\:([\w\._]+)/g;
var ddlKeyReg = /\::([\w\._]+)/g;
var childKeyReg = /\{{\s*([\w\._]+)\s*}}/g;

var _class = function () {
    function _class(dir) {
        _classCallCheck(this, _class);

        this.container = new Map();
        var files = _fs2.default.readdirSync(dir),
            rule = null;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var file = _step.value;

                if (file.indexOf('.swp') == -1) {
                    rule = new _rule2.default(_path2.default.join(dir, file));
                    this.container.set(rule.namespace, rule.rawSql);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    _createClass(_class, [{
        key: 'get',
        value: function get(key, data) {
            var sqlArray = this.getRaw(key);
            var sql = this._parseRawSql(sqlArray, data);
            return this._fillParams(sql, data);
        }
    }, {
        key: 'getRaw',
        value: function getRaw(key) {
            var keys = key.split('.'),
                sql = null;
            if (keys.length < 2) {
                console.error('wrong key, the right key is xxx.xxx');
                return;
            }
            var namespace = keys[0];
            var sqlKey = keys.slice(1).join('');
            var sqlMap = this.container.get(namespace);
            if (sqlMap) {
                sql = sqlMap.get(sqlKey);
                if (!sql) {
                    console.error('The sql:', key, 'not exists!');
                }
            } else {
                console.error('The namespace:', namespace, 'not exists!');
            }
            return sql;
        }
    }, {
        key: '_parseRawSql',
        value: function _parseRawSql(sqlArray, data) {
            var sqls = [],
                result = '',
                condSql = '';
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = sqlArray[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var sql = _step2.value;

                    if (typeof sql == 'string') {
                        sqls.push(sql);
                    } else {
                        condSql = this._parseCond(sql, data);
                        if (condSql != '') {
                            sqls.push(condSql);
                        }
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            result = sqls.join(' ');
            result = result.replace('where and', 'where');
            return result;
        }
    }, {
        key: '_parseCond',
        value: function _parseCond(node, data) {
            var sql = '',
                statements = '';
            data = data || {};
            var context = new _vm2.default.createContext(data);
            if (node.name.toLowerCase() === 'if') {
                if (node.test && typeof node.test == 'string') {
                    statements = node.test.replace(keyReg, function (match, key) {
                        data[key] = data[key] || null;
                        return key;
                    });
                    var isTrue = false;
                    try {
                        isTrue = new _vm2.default.Script(statements).runInContext(context);
                    } catch (e) {
                        isTrue = false;
                    }
                    if (isTrue) {
                        sql = node.sql;
                    }
                }
            }
            return sql.trim();
        }
    }, {
        key: '_fillParams',
        value: function _fillParams(sql, data) {
            var params = [],
                that = this;
            //fill ::key
            sql = sql.replace(ddlKeyReg, function (match, key) {
                return data[key];
            });
            //fill :key
            sql = sql.replace(keyReg, function (match, key) {
                params.push(data[key]);
                return '?';
            });
            //fill {{key}}
            sql = sql.replace(childKeyReg, function (match, key) {
                return that.get(key).sql;
            });
            return {
                sql: sql,
                params: params.length > 0 ? params : null
            };
        }
    }]);

    return _class;
}();

exports.default = _class;
module.exports = exports['default'];