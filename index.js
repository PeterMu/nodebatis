var Rule, SQLContainer, Session, SessionContainer, SessionFactory, pg;

SQLContainer = require('./lib/sqlContainer');

Rule = require('./lib/rule');

Session = require('./lib/session');

SessionContainer = require('./lib/sessionContainer');

pg = require('pg')

SessionFactory = (function() {
  function SessionFactory(dir, options) {
    this.sqlContainer = new SQLContainer;
    Rule.build(dir, this.sqlContainer);
    this.pool = pg;
    this.pool.defaults.user = options.user
    this.pool.defaults.password = options.password
    this.pool.defaults.database = options.database
    this.pool.defaults.host = options.host
    this.pool.defaults.port = options.port || 5432
    this.pool.defaults.poolSize = options.connectionLimit || 3
    this.sessionContainer = new SessionContainer;
  }

  SessionFactory.prototype.getSession = function(callback) {
    var  that;
    that = this;
    this.pool.connect(function(err, conn, done) {
      if (!err) {
        that.sessionContainer.add(conn, sqlContainer, done);
        callback(null, that.sessionContainer.get(conn.processID));
      } else {
        console.log(err);
        callback(err)
      }
    });
  };

  return SessionFactory;

})();

exports.SessionFactory = SessionFactory;

