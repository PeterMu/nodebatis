var SessionFactory, factory;

SessionFactory = require('../index').SessionFactory;

factory = new SessionFactory('/Users/peter/coding/nodebatis/yaml', {
  host: 'localhost',
  user: 'peter',
  password: 'peter',
  database: 'mis',
  connectionLimit: 3
});

console.log('SessionFactory init...');

exports.sessionFactory = factory;

