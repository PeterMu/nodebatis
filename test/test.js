var factory, session;

factory = require('./sessionFactory').sessionFactory;

process.on('uncaughtException', function(err) {
  return console.log(err);
});

factory.getSession(function(err, session) {
  session.beginTransaction(function(err){
    session.delete('a.delete', {
      start: 0,
      limit: 10,
      name: "update"
    },function(){
        session.commit(function(){
            console.log('success') 
        });
    });
  });
})

