Q = require 'q'
class Session
    constructor: (sqlContainer, conn) ->
        @_sqlContainer = sqlContainer
        @_conn = conn

    getConnState: ->
        return @_conn.state

    _processRawSQL: (sqlArray, param) ->
        array = []
        for obj in sqlArray
            if typeof obj is 'string' then array.push obj
            if obj instanceof Object then array.push @_processConds obj, param
        return array.join ' '

    _processConds: (node, param) ->
        if node.name is 'if'
            flag = true
            conds = node.test.split ' and '
            for cond in conds
                if @_parseCond cond, param
                    continue
                else
                    flag = false
                    break
            if flag
                return node.sql.trim()
            else
                return ''
        else
            return ''

    _parseCond: (cond, param) ->
        flag = false
        if param
            switch
                when cond.indexOf('<') isnt -1
                    array = cond.split '<'
                    if param[array[0].trim()] < array[1] then flag = true else flag = false
                when cond.indexOf('>') isnt -1
                    array = cond.split '>'
                    if param[array[0].trim()] > array[1] then flag = true else flag = false
                when cond.indexOf('!=') isnt -1
                    array = cond.split '!='
                    if param[array[0].trim()] isnt array[1] then flag = true else flag = false
                when cond.indexOf('==') isnt -1
                    array = cond.split '=='
                    if param[array[0].trim()] is array[1].trim() then flag = true else flag = false
                else
                    flag = false
        return flag

    escape: (val) ->
        return 'NULL' if val is undefined or val is null
        switch typeof val
            when 'boolean'
                if val then val = 'true' else val = 'false'
                return val
            when 'number'
                return val + ''
        val = val.replace /[\0\n\r\b\t\\\'\"\x1a]/g, (s) ->
            switch s
                when '\0' then '\\0'
                when '\n' then '\\n'
                when '\r' then '\\r'
                when '\b' then '\\b'
                when '\t' then '\\t'
                when '\x1a' then '\\x1a'
                else '\\' + s
        return "'" + val + "'"

    _fillParam: (param) ->
        that = @
        if param
            reg = /\:(\w+)/g
            @sql = @rawSQL.replace reg, (match, key) ->
                return that.escape param[key]
        else
            @sql = @rawSQL
            return @sql

    release: ->
        @_conn.release()
        delete @_conn

    select: (id, param) ->
        that = @
        deferred = Q.defer()
        sqlArray = @_sqlContainer.get id
        @rawSQL = @_processRawSQL sqlArray, param
        @_fillParam param
        @_conn.query @sql, (err, rows) ->
            if err
                console.log err
                deferred.resolve null
            else
                deferred.resolve rows
            that.release()

        return deferred.promise

    selectOne: (id, param) ->
        that = @
        deferred = Q.defer()
        sqlArray = @_sqlContainer.get id
        @rawSQL = @_processRawSQL sqlArray, param
        @_fillParam param
        @_conn.query @sql, (err, rows) ->
            if err
                console.log err
                deferred.resolve null
            else
                if rows.length>0 then deferred.resolve rows[0] else deferred.resolve null
            that.release()
        return deferred.promise

    insert: (id, param) ->
        that = @
        deferred = Q.defer()
        sqlArray = @_sqlContainer.get id
        @rawSQL = @_processRawSQL sqlArray, param
        @_fillParam param
        @_conn.query @sql, (err, result) ->
            if err
                console.log err
                deferred.resolve null
            else
                deferred.resolve result.affectedRows
            that.release()
        return deferred.promise

    update: (id, param) ->
        that = @
        deferred = Q.defer()
        sqlArray = @_sqlContainer.get id
        @rawSQL = @_processRawSQL sqlArray, param
        @_fillParam param
        @_conn.query @sql, (err, result) ->
            if err
                console.log err
                deferred.resolve null
            else
                deferred.resolve result.affectedRows
            that.release()
        return deferred.promise

    commit: ->
        deferred = Q.defer()
        @_conn.commit (err)->
            if err
                deferred.resolve err
            else
                deferred.resolve null
        return deferred.promise

    rollback: ->
        deferred = Q.defer()
        @_conn.rollback (err)->
            if err
                deferred.resolve err
            else
                deferred.resolve null
        return deferred.promise
    
    beginTransaction:  ->
        deferred = Q.defer()
        @_conn.beginTransaction (err) ->
            if err
                deferred.resolve null
            else
                deferred.resolve @
        return deferred.promise

module.exports = Session


