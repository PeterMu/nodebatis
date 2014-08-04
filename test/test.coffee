factory = require('./sessionFactory').sessionFactory
for i in [0..10]
    factory.getSession()
    .then (session) ->
        session.select 'a.selectAll',start:0,limit:10,name:"'name"
    .then (result) ->
        console.log result.length
