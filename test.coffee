DOMParser = require('xmldom').DOMParser
fs = require 'fs'

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

sqlContainer = new SQLContainer

class Rule
    constructor: (dir) ->
        xml = fs.readFileSync(dir).toString()
        @xmlDoc = new DOMParser().parseFromString xml
        @namespace = @xmlDoc.documentElement.getAttribute 'namespace'
        @rawSQL = {}
        @getOper()

    getDocumentElement: ->
        if @xmlDoc.documentElement.nodeName isnt 'mapper'
            return null
        else
            return @xmlDoc.documentElement

    getValue: (val) ->
        return val.replace(/\n/g, '').trim()

    allOper:'select,update,insert,delete,drop'

    #get sql from tags of select,insert...
    getSQL: (dom) ->
        that = @
        sqlArray = []
        id = dom.getAttribute 'id' || 'NOID'
        for sql in dom.childNodes
            #if have childnodes such as having the tag if
            if sql.hasChildNodes()
                cond = {}
                cond.name = sql.tagName
                switch cond.name
                    when 'if'
                        cond.test = that.getValue sql.getAttribute 'test'
                for sub in sql.childNodes
                    cond.sql = that.getValue sub.data
                sqlArray.push cond
            #if have no childnodes,and then push the sql
            else
                sqlArray.push that.getValue sql.data
        @rawSQL[id] = sqlArray

    getOper: ->
        that = @
        #mapper
        doc = @getDocumentElement()
        for oper in doc.childNodes
            if @allOper.indexOf(oper.tagName) isnt -1
                that.getSQL oper

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
                    array = cond.split '!='
                    if param[array[0].trim()] is array[1] then flag = true else flag = false
                else
                    flag = false
        return flag

    select: (id, param, callback) ->
        sqlArray = @sqlContainer.get id
        console.log @rawSQL sqlArray, param


rule = new Rule 'xml/a.xml'
sqlContainer.set rule.namespace, rule.rawSQL
session = new Session sqlContainer
session.select 'a.selectAll',age:0

