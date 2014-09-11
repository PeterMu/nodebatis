var SessionContainer;

SessionContainer = (function() {
  function SessionContainer() {
    this.container = {};
  }

  SessionContainer.prototype.add = function(key, session) {
    if (!this.container[key]) {
      return this.container[key] = session;
    }
  };

  SessionContainer.prototype.get = function(key) {
    var haveKey, sess, _ref;
    _ref = this.container;
    for (haveKey in _ref) {
      sess = _ref[haveKey];
      if (sess.getConnState() === 'disconnected' || sess.getConnState() === 'protocol_error') {
        this._remove(haveKey);
      }
    }
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

