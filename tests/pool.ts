import Pool = require("../index.d");

class Client {
  constructor(connString: string);
  constructor(config: Config);
}

var Options = {
  host: '',
  user: '',
  database: '',
  password: '',
  port: 0,
  min: 0,
  max: 0,
  idleTimeoutMillis: 0
}
var cPool: Pool;
cPool = new Pool(Options);
cPool = new Pool(Options, Client);

cPool.connect((err: Error, client: Client, done: () => void) => { });
cPool.take((err: Error, client: Client, done: () => void) => { });
cPool.query('', () => { }).then(() => { });
