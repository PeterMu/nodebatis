'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var NodeBatis = require('../../dist/nodebatis');
var path = require('path');

var Types = NodeBatis.Types;

var nodebatis = new NodeBatis(path.resolve(__dirname, '../yaml'), {
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
        var tdao, result3, result1, result2;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return nodebatis.getTransation();

                    case 2:
                        tdao = _context.sent;
                        _context.prev = 3;
                        _context.next = 6;
                        return tdao.update('test', { id: 2, name: 'peter', age: 18 });

                    case 6:
                        result3 = _context.sent;
                        _context.next = 9;
                        return tdao.insert('test', { name123: 'peter', age: 28 });

                    case 9:
                        result1 = _context.sent;
                        _context.next = 12;
                        return tdao.query('test.query', { name: 'peter' });

                    case 12:
                        result2 = _context.sent;
                        _context.next = 15;
                        return tdao.commit();

                    case 15:
                        return _context.abrupt('return', result2);

                    case 18:
                        _context.prev = 18;
                        _context.t0 = _context['catch'](3);

                        console.log(_context.t0);
                        _context.next = 23;
                        return tdao.rollback();

                    case 23:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[3, 18]]);
    }));

    return function transationTest() {
        return _ref.apply(this, arguments);
    };
}();_asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    var result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _context2.prev = 0;
                    _context2.next = 3;
                    return transationTest();

                case 3:
                    result = _context2.sent;

                    console.log(result);
                    _context2.next = 10;
                    break;

                case 7:
                    _context2.prev = 7;
                    _context2.t0 = _context2['catch'](0);

                    console.log(_context2.t0);

                case 10:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _callee2, this, [[0, 7]]);
}))();