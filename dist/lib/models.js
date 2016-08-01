'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);

        this.map = new Map();
    }

    _createClass(_class, [{
        key: 'set',
        value: function set(key, model) {
            if (key instanceof RegExp) {
                key = '__reg__' + key.toString();
            }
            this.map.set(key, model);
        }
    }, {
        key: 'get',
        value: function get(key) {
            var realKey = key;
            var keys = this.map.keys();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var value = _step.value;

                    if (value.indexOf('__reg__') != -1) {
                        if (new RegExp(value.replace('__reg__', '')).test(key)) {
                            realKey = value;
                            break;
                        }
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

            return this.map.get(realKey);
        }
    }, {
        key: 'validate',
        value: function validate(key, data) {
            var errors = [];
            var model = this.get(key);
            if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) == 'object') {
                if (Object.prototype.toString.call(data) == '[object Array]') {
                    data = data[0];
                }
                if (model) {
                    for (var name in model) {
                        var dataType = model[name];
                        if (dataType instanceof RegExp) {
                            if (!dataType.test(data[name])) {
                                errors.push(key + ': ' + name + ' should match ' + model[name].toString());
                            }
                        } else {
                            if (dataType != 'isString' && !_validator2.default[dataType](data[name].toString())) {
                                errors.push(key + ': ' + name + ' should ' + model[name].replace('is', 'be '));
                            }
                        }
                    }
                }
            }
            if (errors.length > 0) {
                return errors;
            } else {
                return null;
            }
        }
    }]);

    return _class;
}();

exports.default = _class;