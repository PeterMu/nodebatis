var factory, session;

factory = require('./sessionFactory').sessionFactory;

//process.on('uncaughtException', function(err) {
//  return console.log(err);
//});

factory.getSession(function(err, session) {
  session.insert('test.insertOne',function(err, rows){
      console.log(session.sql)
      console.log(rows)
  })
})

