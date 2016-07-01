import PgPool = require("../index.d");

var Options: PgPool.PoolOptions;
var ClientConstructor: PgPool.ClientConstructor;

var Pool: PgPool;
Pool = new PgPool(Options);
Pool = new PgPool(Options, ClientConstructor);

var ConnectCallback: PgPool.ConnectCallback;
Pool.connect().then((Client: PgPool.Client) => { });
Pool.connect(ConnectCallback).then((Client: PgPool.Client) => { });
Pool.take().then((Client: PgPool.Client) => { });
Pool.take(ConnectCallback).then((Client: PgPool.Client) => { });

var QueryCallback: PgPool.QueryCallback;
var QueryConfig: PgPool.QueryConfig;
Pool.query(QueryConfig).then((Result: PgPool.ResultSet) => { });
Pool.query(QueryConfig, QueryCallback).then((Result: PgPool.ResultSet) => { });
Pool.query('').then((Result: PgPool.ResultSet) => { });
Pool.query('', QueryCallback).then((Result: PgPool.ResultSet) => { });
Pool.query('', []).then((Result: PgPool.ResultSet) => { });
Pool.query('', [], QueryCallback).then((Result: PgPool.ResultSet) => { });

var DoneCallback: PgPool.DoneCallback;
Pool.end(DoneCallback).then((X: void) => { });

Pool = Pool.on('', () => { });
