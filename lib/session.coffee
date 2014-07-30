class Session
    constructor: (sqlContainer) ->
        @sqlContainer = sqlContainer

    rawSQL: (sqlArray, param) ->
        array = []
        for obj in sqlArray
            if typeof obj is 'string' then array.push obj
            if obj instanceof Object then array.push @processConds obj, param
        return array.join ' '

    processConds: (node, param) ->
        if node.name is 'if'
            flag = true
            conds = node.test.split ' and '
            for cond in conds
                if @parseCond cond, param
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

    parseCond: (cond, param) ->
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

    fillParam: (param) ->
        that = @
        reg = /\:(\w+)/g
        @exeSQL = @rawSQL.replace reg, (match, key) ->
            return that.escape param[key]
        console.log @exeSQL

    select: (id, param, callback) ->
        sqlArray = @sqlContainer.get id
        @rawSQL = @rawSQL sqlArray, param
        @fillParam param

module.exports = Session
