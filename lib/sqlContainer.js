var SQLContainer;

SQLContainer = (function() {
  function SQLContainer() {
    this.container = {};
  }

  SQLContainer.prototype.set = function(key, sql) {
    this.container[key] = sql;
  };

  SQLContainer.prototype.get = function(key) {
    var keys;
    keys = key.split('.');
    return this.container[keys[0]][keys[1]];
  };

  SQLContainer.prototype.remove = function(key) {
    delete this.container[key];
  };

  return SQLContainer;

})();

module.exports = SQLContainer;

