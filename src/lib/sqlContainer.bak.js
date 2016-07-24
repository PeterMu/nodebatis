var SQLContainer;

SQLContainer = (function() {
  function SQLContainer() {
    this.container = {};
  }

  SQLContainer.prototype.set = function(key, sql) {
    this.container[key] = sql;
  };

  SQLContainer.prototype.get = function(key) {
    var keys, sql;
    keys = key.split('.');
    if(this.container[keys[0]]){
        if(this.container[keys[0]][keys[1]]){
            sql = this.container[keys[0]][keys[1]]
        }else{
            console.error('The SQL:', key, 'not exists!')
        }
    }else{
        console.error('The namespace:', keys[0], 'not exists!')
    }
    return sql
  };

  SQLContainer.prototype.remove = function(key) {
    delete this.container[key];
  };

  return SQLContainer;

})();

module.exports = SQLContainer;

