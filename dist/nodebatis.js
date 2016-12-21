'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _pool = require('./lib/pool');

var _pool2 = _interopRequireDefault(_pool);

var _sqlContainer = require('./lib/sqlContainer');

var _sqlContainer2 = _interopRequireDefault(_sqlContainer);

var _models = require('./lib/models');

var _models2 = _interopRequireDefault(_models);

var _types = require('./types');

var _types2 = _interopRequireDefault(_types);

var _sqlBuilder = require('./lib/sqlBuilder');

var builder = _interopRequireWildcard(_sqlBuilder);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NodeBatis = function () {
    function NodeBatis(dir, config) {
        _classCallCheck(this, NodeBatis);

        if (!dir) {
            throw new Error('please set dir!');
        }
        if (!config) {
            throw new Error('please set config!');
        }
        this.dir = dir;
        this.debug = config.debug || false;
        this.models = new _models2.default();
        this.pool = new _pool2.default(config, this.models);
        this.sqlContainer = new _sqlContainer2.default(dir);
    }

    _createClass(NodeBatis, [{
        key: 'execute',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(key, data, transationConn) {
                var sqlObj, result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                sqlObj = this.sqlContainer.get(key, data);

                                if (this.debug) {
                                    console.info(key, sqlObj.sql, sqlObj.params || '');
                                }
                                _context.next = 4;
                                return this.pool.query(key, sqlObj.sql, sqlObj.params, transationConn);

                            case 4:
                                result = _context.sent;
                                return _context.abrupt('return', result);

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function execute(_x, _x2, _x3) {
                return _ref.apply(this, arguments);
            }

            return execute;
        }()
    }, {
        key: 'query',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(key, data, transationConn) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.execute(key, data, transationConn);

                            case 2:
                                return _context2.abrupt('return', _context2.sent);

                            case 3:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function query(_x4, _x5, _x6) {
                return _ref2.apply(this, arguments);
            }

            return query;
        }()
    }, {
        key: 'insert',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(tableName, data, transationConn) {
                var sqlObj, key;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (!(tableName && data)) {
                                    _context3.next = 9;
                                    break;
                                }

                                sqlObj = builder.getInsertSql(tableName, data);
                                key = '_auto_builder_insert_' + tableName;

                                if (this.debug) {
                                    console.info(key, sqlObj.sql, sqlObj.params || '');
                                }
                                _context3.next = 6;
                                return this.pool.query(key, sqlObj.sql, sqlObj.params, transationConn);

                            case 6:
                                return _context3.abrupt('return', _context3.sent);

                            case 9:
                                console.error('insert need tableName and data');

                            case 10:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function insert(_x7, _x8, _x9) {
                return _ref3.apply(this, arguments);
            }

            return insert;
        }()
    }, {
        key: 'update',
        value: function () {
            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(tableName, data, idKey, transationConn) {
                var sqlObj, key;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (!(tableName && data)) {
                                    _context4.next = 9;
                                    break;
                                }

                                sqlObj = builder.getUpdateSql(tableName, data, idKey);
                                key = '_auto_builder_update_' + tableName;

                                if (this.debug) {
                                    console.info(key, sqlObj.sql, sqlObj.params || '');
                                }
                                _context4.next = 6;
                                return this.pool.query(key, sqlObj.sql, sqlObj.params, transationConn);

                            case 6:
                                return _context4.abrupt('return', _context4.sent);

                            case 9:
                                console.error('update need tableName and data');

                            case 10:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function update(_x10, _x11, _x12, _x13) {
                return _ref4.apply(this, arguments);
            }

            return update;
        }()
    }, {
        key: 'del',
        value: function () {
            var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(tableName, id, idKey, transationConn) {
                var sqlObj, key;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (!(tableName && id)) {
                                    _context5.next = 9;
                                    break;
                                }

                                sqlObj = builder.getDelSql(tableName, id, idKey);
                                key = '_auto_builder_del_' + tableName;

                                if (this.debug) {
                                    console.info(key, sqlObj.sql, sqlObj.params || '');
                                }
                                _context5.next = 6;
                                return this.pool.query(key, sqlObj.sql, sqlObj.params, transationConn);

                            case 6:
                                return _context5.abrupt('return', _context5.sent);

                            case 9:
                                console.error('del need tableName and id');

                            case 10:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function del(_x14, _x15, _x16, _x17) {
                return _ref5.apply(this, arguments);
            }

            return del;
        }()
    }, {
        key: 'beginTransation',
        value: function () {
            var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
                var _this = this;

                var that, conn;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                that = this;
                                _context7.next = 3;
                                return this.pool.beginTransation();

                            case 3:
                                conn = _context7.sent;

                                conn.execute = function () {
                                    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(key, data) {
                                        return regeneratorRuntime.wrap(function _callee6$(_context6) {
                                            while (1) {
                                                switch (_context6.prev = _context6.next) {
                                                    case 0:
                                                        _context6.next = 2;
                                                        return that.execute.apply(that, [key, data, conn]);

                                                    case 2:
                                                        return _context6.abrupt('return', _context6.sent);

                                                    case 3:
                                                    case 'end':
                                                        return _context6.stop();
                                                }
                                            }
                                        }, _callee6, _this);
                                    }));

                                    return function (_x18, _x19) {
                                        return _ref7.apply(this, arguments);
                                    };
                                }();
                                return _context7.abrupt('return', conn);

                            case 6:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function beginTransation() {
                return _ref6.apply(this, arguments);
            }

            return beginTransation;
        }()
    }, {
        key: 'commit',
        value: function () {
            var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(conn) {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.pool.commit(conn);

                            case 2:
                                return _context8.abrupt('return', _context8.sent);

                            case 3:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function commit(_x20) {
                return _ref8.apply(this, arguments);
            }

            return commit;
        }()
    }, {
        key: 'rollback',
        value: function () {
            var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(conn) {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.pool.rollback(conn);

                            case 2:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function rollback(_x21) {
                return _ref9.apply(this, arguments);
            }

            return rollback;
        }()
    }, {
        key: 'releaseConn',
        value: function releaseConn(connection) {
            return this.pool.releaseConn(connection);
        }
    }, {
        key: 'define',
        value: function define(key, model) {
            this.models.set(key, model);
        }
    }]);

    return NodeBatis;
}();

NodeBatis.Types = _types2.default;

exports.default = NodeBatis;