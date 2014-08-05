factory = require('./sessionFactory').sessionFactory

process.on 'uncaughtException', (err) ->
    console.log err

#factory.getSession()
#.then (session) ->
#    session.update 'a.update',start:0,limit:10,name:"update"
#.then (result) ->
#    console.log result
session = null
factory.getSession()
.then (sess) ->
    session = sess
    session.beginTransaction()
.then (err) ->
    session.update 'a.update',start:0,limit:10,name:"update"
.then (result) ->
    session.commit()
.then (err) ->
    console.log '====',err
.done()
