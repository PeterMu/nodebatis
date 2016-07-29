'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pool = require('./dialects/mysql/pool');

var _pool2 = _interopRequireDefault(_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(config, models) {
        _classCallCheck(this, _class);

        this.config = Object.assign({
            dialect: 'mysql',
            host: '127.0.0.1',
            port: null,
            database: null,
            user: null,
            password: null,
            minPoolSize: 2,
            maxPoolSize: 20
        }, config);
        this.models = models;
        if (this.config.dialect == 'mysql') {
            this._pool = new _pool2.default(this.config);
        }
    }

    _createClass(_class, [{
        key: 'getConn',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var conn;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this._pool.getConn();

                            case 2:
                                conn = _context.sent;
                                return _context.abrupt('return', conn);

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getConn() {
                return _ref.apply(this, arguments);
            }

            return getConn;
        }()
    }, {
        key: 'releaseConn',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(conn) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                conn.release();

                            case 1:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function releaseConn(_x) {
                return _ref2.apply(this, arguments);
            }

            return releaseConn;
        }()
    }, {
        key: 'query',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(key, sql, params) {
                var _this = this;

                var that, _ret;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                that = this;
                                _context4.prev = 1;
                                return _context4.delegateYield(regeneratorRuntime.mark(function _callee3() {
                                    var conn, that;
                                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                        while (1) {
                                            switch (_context3.prev = _context3.next) {
                                                case 0:
                                                    params = params || [];
                                                    _context3.next = 3;
                                                    return _this.getConn();

                                                case 3:
                                                    conn = _context3.sent;
                                                    that = _this;
                                                    return _context3.abrupt('return', {
                                                        v: new Promise(function (resolve, reject) {
                                                            conn.query(sql, params, function (err, results) {
                                                                if (!err) {
                                                                    var errors = that.models.validate(key, results);
                                                                    if (errors) {
                                                                        reject(errors);
                                                                    } else {
                                                                        resolve(results);
                                                                    }
                                                                } else {
                                                                    reject(err);
                                                                }
                                                                that.releaseConn(conn);
                                                            });
                                                        })
                                                    });

                                                case 6:
                                                case 'end':
                                                    return _context3.stop();
                                            }
                                        }
                                    }, _callee3, _this);
                                })(), 't0', 3);

                            case 3:
                                _ret = _context4.t0;

                                if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
                                    _context4.next = 6;
                                    break;
                                }

                                return _context4.abrupt('return', _ret.v);

                            case 6:
                                _context4.next = 12;
                                break;

                            case 8:
                                _context4.prev = 8;
                                _context4.t1 = _context4['catch'](1);

                                console.error(_context4.t1);
                                throw new Error(_context4.t1);

                            case 12:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[1, 8]]);
            }));

            function query(_x2, _x3, _x4) {
                return _ref3.apply(this, arguments);
            }

            return query;
        }()
    }, {
        key: 'beginTransation',
        value: function () {
            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                var conn;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this._pool.getTransationConn();

                            case 2:
                                conn = _context5.sent;
                                return _context5.abrupt('return', conn);

                            case 4:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function beginTransation() {
                return _ref4.apply(this, arguments);
            }

            return beginTransation;
        }()
    }, {
        key: 'commit',
        value: function () {
            var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(conn) {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this._pool.commit(conn);

                            case 2:
                                return _context6.abrupt('return', _context6.sent);

                            case 3:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function commit(_x5) {
                return _ref5.apply(this, arguments);
            }

            return commit;
        }()
    }, {
        key: 'rollback',
        value: function () {
            var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(conn) {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this._pool.rollback(conn);

                            case 2:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function rollback(_x6) {
                return _ref6.apply(this, arguments);
            }

            return rollback;
        }()
    }, {
        key: 'dialect',
        get: function get() {
            return this.config.dialect;
        }
    }, {
        key: 'host',
        get: function get() {
            return this.config.host;
        }
    }, {
        key: 'port',
        get: function get() {
            if (this.config.port) {
                return this.config.port;
            } else {
                throw new Error('the port is null, please set port');
            }
        }
    }, {
        key: 'user',
        get: function get() {
            if (this.config.user) {
                return this.config.user;
            } else {
                throw new Error('the user is null, please set user');
            }
        }
    }, {
        key: 'password',
        get: function get() {
            if (this.config.password) {
                return this.config.password;
            } else {
                throw new Error('the password is null, please set password');
            }
        }
    }, {
        key: 'minPoolSize',
        get: function get() {
            return this.config.minPoolSize;
        }
    }, {
        key: 'maxPoolSize',
        get: function get() {
            return this.config.maxPoolSize;
        }
    }]);

    return _class;
}();

exports.default = _class;