'use strict';

var _nodebatis = require('../../src/nodebatis');

var _nodebatis2 = _interopRequireDefault(_nodebatis);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Types = _nodebatis2.default.Types;

var nodebatis = new _nodebatis2.default(_path2.default.resolve(__dirname, '../yaml'), {
    debug: true,
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'test',
    user: 'root',
    password: 'root',
    pool: {
        minSize: 5,
        maxSize: 20,
        acquireIncrement: 5
    }
});

var transationTest = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var conn, result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        conn = null;
                        _context.prev = 1;
                        _context.next = 4;
                        return nodebatis.beginTransation();

                    case 4:
                        conn = _context.sent;

                        console.log('begin insert...');
                        _context.next = 8;
                        return conn.execute('test.insertOne', {
                            name: 'name3',
                            age: 19
                        });

                    case 8:
                        console.log('end insert');
                        console.log('begin find ...');
                        _context.next = 12;
                        return conn.execute('test.findTest');

                    case 12:
                        result = _context.sent;

                        console.log(result);
                        nodebatis.commit(conn);
                        return _context.abrupt('return', result);

                    case 18:
                        _context.prev = 18;
                        _context.t0 = _context['catch'](1);

                        console.log(_context.t0);
                        nodebatis.rollback(conn);

                    case 22:
                        _context.prev = 22;

                        conn && nodebatis.releaseConn(conn);
                        return _context.finish(22);

                    case 25:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[1, 18, 22, 25]]);
    }));

    return function transationTest() {
        return _ref.apply(this, arguments);
    };
}();

transationTest();