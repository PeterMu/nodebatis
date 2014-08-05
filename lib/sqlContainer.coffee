class SQLContainer
    constructor: ->
        @container = {}
    set: (key, sql) ->
        @container[key] = sql
    get: (key) ->
        keys = key.split '.'
        return @container[keys[0]][keys[1]]
    remove: (key) ->
        delete @container[key]

module.exports = SQLContainer
