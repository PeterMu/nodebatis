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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(dir, config) {
        _classCallCheck(this, _class);

        if (!dir) {
            throw new Error('please set dir!');
        }
        if (!config) {
            throw new Error('please set config!');
        }
        this.dir = dir;
        this.debug = config.debug || false;
        this.pool = new _pool2.default(config);
        this.sqlContainer = new _sqlContainer2.default(dir);
    }

    _createClass(_class, [{
        key: 'query',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(key, data) {
                var sqlObj, result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                sqlObj = this.sqlContainer.get(key, data);

                                if (this.debug) {
                                    console.info(key, sqlObj.sql);
                                }
                                _context.next = 4;
                                return this.pool.query(sqlObj.sql, sqlObj.params);

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

            function query(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return query;
        }()
    }, {
        key: 'beginTransation',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.pool.getTransationConn();

                            case 2:
                                return _context2.abrupt('return', _context2.sent);

                            case 3:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function beginTransation() {
                return _ref2.apply(this, arguments);
            }

            return beginTransation;
        }()
    }, {
        key: 'commit',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(conn) {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.pool.commit(conn);

                            case 2:
                                return _context3.abrupt('return', _context3.sent);

                            case 3:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function commit(_x3) {
                return _ref3.apply(this, arguments);
            }

            return commit;
        }()
    }, {
        key: 'rollback',
        value: function () {
            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(conn) {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.pool.rollback(conn);

                            case 2:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function rollback(_x4) {
                return _ref4.apply(this, arguments);
            }

            return rollback;
        }()
    }, {
        key: 'releaseConn',
        value: function () {
            var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(connection) {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.pool.releaseConn(connection);

                            case 2:
                                return _context5.abrupt('return', _context5.sent);

                            case 3:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function releaseConn(_x5) {
                return _ref5.apply(this, arguments);
            }

            return releaseConn;
        }()
    }]);

    return _class;
}();

exports.default = _class;