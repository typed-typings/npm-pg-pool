import Pool = require("../index.d");

var pool = new Pool({
  user: 'foo',
  password: 'bar',
  host: 'localhost',
  database: 'my_db',
  max: 10, // max number of clients in pool
  idleTimeoutMillis: 1000, // close & remove clients which have been idle > 1 second
});

pool.on('error', function(e, client) {
  // if a client is idle in the pool
  // and receives an error - for example when your PostgreSQL server restarts
  // the pool will catch the error & let you handle it here
});

// you can run queries directly against the pool
pool.query('SELECT $1::text as name', ['foo'], function(err, result) {
  console.log(result.rows[0].name); // output: foo
});

// the query object implements the promise API
pool.query('SELECT $1::text as name', ['foo'])
  .then(res => console.log(res.rows[0].name)); // output: foo

// the pool also supports checking out a client for
// multiple operations, such as a transaction

pool.connect(function(err, client, release) {
  // TODO - you'll want to handle the error in real code

  client.query('SELECT $1::text as name', ['foo'], function(err, result) {
    // you MUST return your client back to the pool when you're done!
    release();
    console.log(result.rows[0].name); // output: foo
  });
});
