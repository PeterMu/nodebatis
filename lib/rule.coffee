DOMParser = require('xmldom').DOMParser
fs = require 'fs'

class Rule
    constructor: (dir) ->
        xml = fs.readFileSync(dir).toString()
        @_xmlDoc = new DOMParser().parseFromString xml
        @namespace = @_xmlDoc.documentElement.getAttribute 'namespace'
        @rawSQL = {}
        @_getOper()

    _getDocumentElement: ->
        if @_xmlDoc.documentElement.nodeName isnt 'mapper'
            return null
        else
            return @_xmlDoc.documentElement

    _getValue: (val) ->
        return val.replace(/\n/g, '').trim()

    _allOper:'select,update,insert,delete,drop'

    #get sql from tags of select,insert...
    _getSQL: (dom) ->
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
                sqlArray.push that._getValue sql.data
        @rawSQL[id] = sqlArray

    _getOper: ->
        that = @
        #mapper
        doc = @_getDocumentElement()
        for oper in doc.childNodes
            if @_allOper.indexOf(oper.tagName) isnt -1
                that._getSQL oper
build = (dir, sqlContainer) ->
    files = fs.readdirSync dir
    for file in files
        rule = new Rule dir+'/'+file
        sqlContainer.set rule.namespace, rule.rawSQL

exports.build = build

