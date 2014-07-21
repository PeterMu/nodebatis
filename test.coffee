XMLReader = require 'xmlreader'
fs = require 'fs'
data = fs.readFileSync './xml/a.xml', 'utf-8'
mappers = {}
XMLReader.read data, (err, res)->
    mapper = {}
    xml = res.mapper
    xml.select.each (index, select)->
        mapper[select.attributes().id] = []
        mapper[select.attributes().id].push select.text()
        select.if.each (i, o)->
            cond = o.attributes().test
            mapper[select.attributes().id].push o.text() if cond
    console.log mapper
