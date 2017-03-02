'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var STRING = 'isString';
var NUMBER = 'isNumeric';
var INT = 'isInt';
var FLOAT = 'isFloat';
var DECIMAL = 'isDecimal';
var BOOLEAN = 'isBoolean';
var DATE = 'isDate';
var UUID = 'isUUID';
var URL = 'isURL';
var IP = 'isIP';
var EMAIL = 'isEmail';
var MONGOID = 'isMongoId';
var JSON = 'isJSON';
var MATCHES = /\.*/;

exports.default = {
    STRING: STRING,
    NUMBER: NUMBER,
    INT: INT,
    FLOAT: FLOAT,
    DECIMAL: DECIMAL,
    BOOLEAN: BOOLEAN,
    DATE: DATE,
    UUID: UUID,
    URL: URL,
    IP: IP,
    EMAIL: EMAIL,
    MONGOID: MONGOID,
    JSON: JSON,
    MATCHES: MATCHES
};
module.exports = exports['default'];