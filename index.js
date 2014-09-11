var Rule, SQLContainer, Session, SessionContainer, SessionFactory, mysql;

SQLContainer = require('./lib/sqlContainer');

Rule = require('./lib/rule');

Session = require('./lib/session');

SessionContainer = require('./lib/sessionContainer');

mysql = require('mysql');

SessionFactory = (function() {
  function SessionFactory(dir, options) {
    this.sqlContainer = new SQLContainer;
    Rule.build(dir, this.sqlContainer);
    this.pool = mysql.createPool(options);
    this.sessionContainer = new SessionContainer;
  }

  SessionFactory.prototype.getSession = function(callback) {
    var  that;
    that = this;
    this.pool.getConnection(function(err, conn) {
      if (!err) {
        that.sessionContainer.add(conn.threadId, new Session(that.sqlContainer, conn));
        callback(null, that.sessionContainer.get(conn.threadId));
      } else {
        console.log(err);
        callback(err)
      }
    });
  };

  return SessionFactory;

})();

exports.SessionFactory = SessionFactory;

