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
		var conn, result1, result2, result3, result4;
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
						_context.next = 7;
						return nodebatis.insert('test', { name: 'bezos', age: 22 }, conn);

					case 7:
						result1 = _context.sent;
						_context.next = 10;
						return nodebatis.query('test.query', { name: 'bezos', age: 19 }, conn);

					case 10:
						result2 = _context.sent;
						_context.next = 13;
						return nodebatis.update('test', { id: 1, name: 'Air', age: 25 }, 'id', conn);

					case 13:
						result3 = _context.sent;
						_context.next = 16;
						return nodebatis.del('test', 1, 'id', conn);

					case 16:
						result4 = _context.sent;

						nodebatis.commit(conn);
						return _context.abrupt('return', result2);

					case 21:
						_context.prev = 21;
						_context.t0 = _context['catch'](1);

						console.log(_context.t0);
						nodebatis.rollback(conn);

					case 25:
						_context.prev = 25;

						conn && nodebatis.releaseConn(conn);
						return _context.finish(25);

					case 28:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined, [[1, 21, 25, 28]]);
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