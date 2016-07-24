var yaml, Rule, build, fs;


fs = require('fs');
yaml = require('js-yaml');

Rule = (function() {
  function Rule(dir) {
    var doc = yaml.safeLoad(fs.readFileSync(dir, 'utf8')) 
    this.doc = doc;
    this.namespace = doc.namespace;
    this.rawSQL = {};
    this._getOper();
  }

  Rule.prototype._getValue = function(val) {
    return val.replace(/\n/g, '').trim();
  };

  Rule.prototype._allOper = 'select,update,insert,delete,drop,create';

  Rule.prototype._getSQL = function(name, oper) {
    var sqlArray = [];
    var cond;
    if(typeof oper == 'string'){
        sqlArray.push(this._getValue(oper));
    }else{
      for(var i=0;i<oper.length;i++){
        if(typeof oper[i] == 'string'){
          sqlArray.push(oper[i]) 
        }else{
          for(var key in oper[i]){
            cond = {};
            cond.name = key;
            switch(cond.name){
                case 'if':
                    cond.test = oper[i]['if'].test;
            }
            cond.sql = oper[i]['if'].sql;
          }
          sqlArray.push(cond)
        }
      }
    }
    this.rawSQL[name] = sqlArray;
  };

  Rule.prototype._getOper = function() {
    var oper;
    for (var key in this.doc) {
      if(key != 'namespace'){
        oper = this.doc[key];
        this._getSQL(key, oper);
      }
    }
  };

  return Rule;

})();

build = function(dir, sqlContainer) {
  var file, files, rule, len;
  files = fs.readdirSync(dir);
  results = [];
  for (var i = 0, len = files.length; i < len; i++) {
    file = files[i];
    if(file.indexOf('.swp') != -1) continue;
    rule = new Rule(dir + '/' + file);
    sqlContainer.set(rule.namespace, rule.rawSQL);
  }
}

exports.build = build;

