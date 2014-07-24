DOMParser = require('xmldom').DOMParser
fs = require 'fs'

class Rule
    constructor: (dir) ->
        xml = fs.readFileSync(dir).toString()
        @xmlDoc = new DOMParser().parseFromString xml
        @result = {}
    getDocumentElement: ->
        if @xmlDoc.documentElement.nodeName isnt 'mapper'
            return null
        else
            return @xmlDoc.documentElement
    getValue: (val) ->
        return val.replace(/\n/g, '').trim()
    getSQL: (dom) ->
        that = @
        sqlArray = []
        id = dom.getAttribute 'id' || 'NOID'
        for sql in dom.childNodes
            if sql.hasChildNodes()
                cond = {}
                cond.name = sql.tagName
                cond.test = that.getValue sql.getAttribute 'test'
                for sub in sql.childNodes
                    do(sub) ->
                        cond.sql = that.getValue sub.data
                sqlArray.push cond
            else
                sqlArray.push that.getValue sql.data
        @result[id] = sqlArray
        @rawSQL sqlArray
    getOper: ->
        that = @
        doc = @getDocumentElement()
        for oper in doc.childNodes
            if oper.tagName
                that.getSQL oper
    rawSQL: (sqlArray) ->
       rawArray = []
       for obj in sqlArray
           rawArray.push obj if typeof obj is 'string'
           rawArray.push obj.sql if obj instanceof Object
       console.log rawArray.join ' '

rule = new Rule 'xml/a.xml'
rule.getOper()


