'use strict';

var factory, session;

factory = require('./sessionFactory').sessionFactory;

//process.on('uncaughtException', function(err) {
//  return console.log(err);
//});

factory.getSession(function (err, session) {
    session.beginTransaction(function (err) {
        if (err) return;
        session.insert('test.addTestName', {
            name: 'test1'
        }, function (err, rows) {
            console.log(session.sql);
            console.log(rows);
        });
        session.insert('test.addTestName', {
            name: 'test2'
        }, function (err, rows) {
            console.log(session.sql);
            console.log(rows);
        });
        //session.commit()
        session.rollback();
    });
});