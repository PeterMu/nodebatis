DOMParser = require('xmldom').DOMParser
fs = require 'fs'

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
build = (dir, sqlContainer) ->
    fs.readdirSync dir, (err, files) ->
        for file in files
            rule = new Rule dir+'/'+file
            sqlContainer.set rule.namespace, rule.rawSQL

exports.build =build

