var DOMParser, Rule, build, fs;

DOMParser = require('xmldom').DOMParser;

fs = require('fs');

Rule = (function() {
  function Rule(dir) {
    var xml;
    xml = fs.readFileSync(dir).toString();
    this._xmlDoc = new DOMParser().parseFromString(xml);
    this.namespace = this._xmlDoc.documentElement.getAttribute('namespace');
    this.rawSQL = {};
    this._getOper();
  }

  Rule.prototype._getDocumentElement = function() {
    if (this._xmlDoc.documentElement.nodeName !== 'mapper') {
      return null;
    } else {
      return this._xmlDoc.documentElement;
    }
  };

  Rule.prototype._getValue = function(val) {
    return val.replace(/\n/g, '').trim();
  };

  Rule.prototype._allOper = 'select,update,insert,delete,drop';

  Rule.prototype._getSQL = function(dom) {
    var cond, id, sql, sqlArray, sub, that, _i, _j, _len, _len1, _ref, _ref1;
    that = this;
    sqlArray = [];
    id = dom.getAttribute('id' || 'NOID');
    _ref = dom.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      sql = _ref[_i];
      if (sql.hasChildNodes()) {
        cond = {};
        cond.name = sql.tagName;
        switch (cond.name) {
          case 'if':
            cond.test = that.getValue(sql.getAttribute('test'));
        }
        _ref1 = sql.childNodes;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          sub = _ref1[_j];
          cond.sql = that.getValue(sub.data);
        }
        sqlArray.push(cond);
      } else {
        sqlArray.push(that._getValue(sql.data));
      }
    }
    return this.rawSQL[id] = sqlArray;
  };

  Rule.prototype._getOper = function() {
    var doc, oper, that, _i, _len, _ref, _results;
    that = this;
    doc = this._getDocumentElement();
    _ref = doc.childNodes;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      oper = _ref[_i];
      if (this._allOper.indexOf(oper.tagName) !== -1) {
        _results.push(that._getSQL(oper));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  return Rule;

})();

build = function(dir, sqlContainer) {
  var file, files, rule, _i, _len, _results;
  files = fs.readdirSync(dir);
  _results = [];
  for (_i = 0, _len = files.length; _i < _len; _i++) {
    file = files[_i];
    rule = new Rule(dir + '/' + file);
    _results.push(sqlContainer.set(rule.namespace, rule.rawSQL));
  }
  return _results;
};

exports.build = build;

