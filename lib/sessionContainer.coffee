class SessionContainer
    constructor: ->
        @container = {}
    
    add: (key, session) ->
        if not @container[key]
            @container[key] = session
    
    get: (key) ->
        for haveKey,sess of @container
            @_remove haveKey if sess.getConnState() is 'disconnected' or sess.getConnState() is 'protocol_error'
        if @container[key]
            return @container[key]
        else
            return null

    _remove: (key) ->
        delete @container[key]

module.exports = SessionContainer
