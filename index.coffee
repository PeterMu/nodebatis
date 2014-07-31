SQLContainer = require './lib/sqlContainer'
Rule = require './lib/rule'
Session = require './lib/session'
mysql = require 'mysql'
Q = require 'q'

class SessionFactory
    constructor: (dir, options) ->
        @sqlContainer = new SQLContainer
        Rule.build dir, @sqlContainer
        @pool = mysql.createPool options
        @sessionContainer = {}

    getSession: ->
        that = @
        deferred = Q.defer()
        @pool.getConnection (err, conn) ->
            if !err
                if !that.sessionContainer[conn.threadId]
                    that.sessionContainer[conn.threadId] = new Session that.sqlContainer, conn
                deferred.resolve that.sessionContainer[conn.threadId]
            else
                console.log err
                deferred.resolve null
        return deferred.promise

exports.SessionFactory = SessionFactory

