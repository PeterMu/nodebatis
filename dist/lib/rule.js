'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(file) {
        _classCallCheck(this, _class);

        this.doc = _jsYaml2.default.safeLoad(_fs2.default.readFileSync(file, 'utf8'));
        this.namespace = this.doc.namespace;
        this.rawSql = new Map();
        this.getAllSql();
    }

    _createClass(_class, [{
        key: 'getAllSql',
        value: function getAllSql() {
            for (var key in this.doc) {
                if (key != 'namespace') {
                    this.getSql(key, this.doc[key]);
                }
            }
        }
    }, {
        key: 'getSql',
        value: function getSql(name, sql) {
            var sqls = [],
                cond = {};
            if (typeof sql == 'string') {
                sqls.push(sql.replace(/\n/g, '').trim());
            } else {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = sql[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var s = _step.value;

                        if (typeof s == 'string') {
                            sqls.push(s.replace(/\n/g, '').trim());
                        } else {
                            for (var key in s) {
                                cond = {};
                                cond.name = key;
                                switch (key) {
                                    case 'if':
                                        cond.test = s['if'].test;
                                }
                                cond.sql = s['if'].sql;
                            }
                            sqls.push(cond);
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
            this.rawSql.set(name, sqls);
        }
    }]);

    return _class;
}();

exports.default = _class;