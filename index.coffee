SQLContainer = require './lib/sqlContainer'
Rule = require './lib/rule'
Session = require './lib/session'
SessionContainer = require './lib/sessionContainer'
mysql = require 'mysql'
Q = require 'q'

class SessionFactory
    constructor: (dir, options) ->
        @sqlContainer = new SQLContainer
        Rule.build dir, @sqlContainer
        @pool = mysql.createPool options
        @sessionContainer = new SessionContainer

    getSession: ->
        that = @
        deferred = Q.defer()
        @pool.getConnection (err, conn) ->
            if !err
                that.sessionContainer.add conn.threadId, new Session that.sqlContainer, conn
                deferred.resolve that.sessionContainer.get conn.threadId
            else
                console.log err
                deferred.resolve null
        return deferred.promise

exports.SessionFactory = SessionFactory

