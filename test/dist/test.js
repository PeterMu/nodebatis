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

var queryTest = function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(name, age) {
		var ret;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.prev = 0;
						_context.next = 3;
						return nodebatis.query('test.query', { name: name, age: age });

					case 3:
						ret = _context.sent;

						console.log('result', JSON.stringify(ret));
						_context.next = 10;
						break;

					case 7:
						_context.prev = 7;
						_context.t0 = _context['catch'](0);

						console.log(_context.t0);

					case 10:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined, [[0, 7]]);
	}));

	return function queryTest(_x, _x2) {
		return _ref.apply(this, arguments);
	};
}();

var insertTest = function () {
	var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
		var ret;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return nodebatis.insert('test', { age: 29, name: 'peter' });

					case 2:
						ret = _context2.sent;

						console.log(ret);

					case 4:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, undefined);
	}));

	return function insertTest() {
		return _ref2.apply(this, arguments);
	};
}();

var updateTest = function () {
	var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
		var ret;
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return nodebatis.update('test', { id: 1, age: 21, name: 'bezos' }, 'id');

					case 2:
						ret = _context3.sent;

						console.log(ret);

					case 4:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, undefined);
	}));

	return function updateTest() {
		return _ref3.apply(this, arguments);
	};
}();

var deleteTest = function () {
	var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
		var ret;
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.next = 2;
						return nodebatis.del('test', 1, 'id');

					case 2:
						ret = _context4.sent;

						console.log(ret);

					case 4:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, undefined);
	}));

	return function deleteTest() {
		return _ref4.apply(this, arguments);
	};
}();

queryTest();