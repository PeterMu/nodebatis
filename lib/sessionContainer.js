var SessionContainer, Session;

Session = require('./session');

SessionContainer = (function() {
  function SessionContainer() {
    this.container = {};
  }

  SessionContainer.prototype.add = function(conn, sqlContainer, done) {
    var key = conn.processID;  
    if (!this.container[key]) {
        this.container[key] = new Session(sqlContainer, conn, done);
    } else {
        this.container[key].resetConn(conn, done)
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

