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

    processChildNode: (node) ->
        if node.name is 'if'
            conds = node.test.split ' and '
            for cond in conds
                @parseCond cond

class Session
    constructor: (sqlContainer) ->
        @sqlContainer = sqlContainer

    rawSQL: (sqlArray, param) ->
        array = []
        for obj in sqlArray
            if typeof obj is 'string' then array.push obj
            if obj instanceof Object then array.push @parseCond obj, param

    parseCond: (cond, param) ->
        oper = switch
            when cond.indexOf('<') isnt -1 then '<'
            when cond.indexOf('>') isnt -1 then '>'
            when cond.indexOf('!=') isnt -1 then '!=='
            when cond.indexOf('==') isnt -1 then '==='
            else ''

    select: (id, param, callback) ->
        sqlArray = @sqlContainer.get id
        console.log sqlArray


rule = new Rule 'xml/a.xml'
sqlContainer.set rule.namespace, rule.rawSQL
session = new Session sqlContainer
session.select 'a.selectAll'

