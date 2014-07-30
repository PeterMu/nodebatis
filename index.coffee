SQLContainer = require './lib/sqlContainer'
Rule = require './lib/rule'
Session = require './lib/session'

sqlContainer = new SQLContainer
Rule.build __dirname+'/xml', sqlContainer
session = new Session sqlContainer
session.select 'a.selectAll',age:10,sex:'M',id: "'123"
