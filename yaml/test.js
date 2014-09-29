var yaml = require('js-yaml')
var fs = require('fs')
var doc = yaml.safeLoad(fs.readFileSync('./test.yml', 'utf-8'))
console.log(doc)
