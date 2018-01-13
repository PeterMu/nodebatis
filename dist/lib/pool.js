'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pool = require('./dialects/mysql/pool');

var _pool2 = _interopRequireDefault(_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
            charset: 'utf8',
            camelCase: false,
            pool: {
                minSize: 5,
                maxSize: 20,
                acquireIncrement: 5
            }
        }, config);
        this.models = models;
        if (this.config.dialect == 'mysql') {
            this._pool = new _pool2.default(this.config);
        }
    }

    _createClass(_class, [{
        key: 'getConn',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
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
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(conn) {
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
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(key, sql, params, transationConn) {
                var that, conn, _that;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                that = this;
                                _context3.prev = 1;

                                params = params || [];
                                _context3.t0 = transationConn;

                                if (_context3.t0) {
                                    _context3.next = 8;
                                    break;
                                }

                                _context3.next = 7;
                                return this.getConn();

                            case 7:
                                _context3.t0 = _context3.sent;

                            case 8:
                                conn = _context3.t0;
                                _that = this;
                                return _context3.abrupt('return', new Promise(function (resolve, reject) {
                                    conn._query(sql, params, function (err, results) {
                                        if (!err) {
                                            if (_that.config.camelCase) {
                                                results = _that.parseCamelCase(results);
                                            }
                                            var errors = _that.models.validate(key, results);
                                            if (errors) {
                                                reject(errors);
                                            } else {
                                                resolve(results);
                                            }
                                        } else {
                                            reject(err);
                                        }
                                        if (!transationConn) {
                                            _that.releaseConn(conn);
                                        }
                                    });
                                }));

                            case 13:
                                _context3.prev = 13;
                                _context3.t1 = _context3['catch'](1);

                                console.error(_context3.t1);
                                throw new Error(_context3.t1);

                            case 17:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[1, 13]]);
            }));

            function query(_x2, _x3, _x4, _x5) {
                return _ref3.apply(this, arguments);
            }

            return query;
        }()
    }, {
        key: 'beginTransation',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var conn;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this._pool.getTransationConn();

                            case 2:
                                conn = _context4.sent;
                                return _context4.abrupt('return', conn);

                            case 4:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function beginTransation() {
                return _ref4.apply(this, arguments);
            }

            return beginTransation;
        }()
    }, {
        key: 'commit',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(conn) {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this._pool.commit(conn);

                            case 2:
                                return _context5.abrupt('return', _context5.sent);

                            case 3:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function commit(_x6) {
                return _ref5.apply(this, arguments);
            }

            return commit;
        }()
    }, {
        key: 'rollback',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(conn) {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this._pool.rollback(conn);

                            case 2:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function rollback(_x7) {
                return _ref6.apply(this, arguments);
            }

            return rollback;
        }()
    }, {
        key: 'parseCamelCase',
        value: function parseCamelCase(results) {
            var array = [],
                obj = {};
            if (results && results.length > 0) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var ret = _step.value;

                        obj = {};
                        for (var key in ret) {
                            obj[this.getCamelCaseKey(key)] = ret[key];
                        }
                        array.push(obj);
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

                return array;
            } else {
                return results;
            }
        }
    }, {
        key: 'getCamelCaseKey',
        value: function getCamelCaseKey(key) {
            return key.replace(/(_\w)/g, function (match, s) {
                return s.substring(1).toUpperCase();
            });
        }
    }, {
        key: 'getPool',
        value: function getPool() {
            return this.config.pool;
        }
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
    }]);

    return _class;
}();

exports.default = _class;
module.exports = exports['default'];