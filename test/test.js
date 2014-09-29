var factory, session;

factory = require('./sessionFactory').sessionFactory;

//process.on('uncaughtException', function(err) {
//  return console.log(err);
//});

factory.getSession(function(err, session) {
  session.select('test.findAll', {
    name: "test",
    age: 12
  },function(err, rows){
      session.commit(function(){
          console.log(rows) 
      });
  });
})

