var SessionContainer;

SessionContainer = (function() {
  function SessionContainer() {
    this.container = {};
  }

  SessionContainer.prototype.add = function(key, session) {
    //only add if have not a session
    if (!this.container[key]) {
      return this.container[key] = session;
    }
  };

  SessionContainer.prototype.get = function(key) {
    if (this.container[key]) {
      return this.container[key];
    } else {
      return null;
    }
  };

  SessionContainer.prototype._remove = function(key) {
    delete this.container[key];
  };

  return SessionContainer;

})();

module.exports = SessionContainer;

