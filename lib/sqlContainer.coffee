class SQLContainer
    constructor: ->
        @container = {}
    set: (key, sql) ->
        @container[key] = sql
    get: (key) ->
        keys = key.split '.'
        return @container[keys[0]][keys[1]]
    remove: (key) ->
        @container[key] = null

module.exports = SQLContainer
