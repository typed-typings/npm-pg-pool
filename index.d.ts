import { EventEmitter } from 'events';
import { Promise } from 'es6-promise';
import * as pg from 'pg';

declare class Pool extends EventEmitter {
  constructor(options: Pool.PoolOptions, Client?: pg.ClientConstructor);
  connect(cb?: pg.ConnectCallback): Promise<pg.Client>;
  take(cb?: pg.ConnectCallback): Promise<pg.Client>;
  query(query: pg.QueryConfig, callback?: pg.QueryCallback): Promise<pg.ResultSet>;
  query(text: string, callback?: pg.QueryCallback): Promise<pg.ResultSet>;
  query(text: string, values: any[], callback?: pg.QueryCallback): Promise<pg.ResultSet>;
  end(cb: pg.DoneCallback): Promise<void>;

  on(event: "connect", listener: (client: pg.Client) => void): this;
  on(event: "acquire", listener: (client: pg.Client) => void): this;
  on(event: "error", listener: (err: Error) => void): this;
  on(event: string, listener: Function): this;
}

declare namespace Pool {

  export interface PoolOptions {
    host?: string;
    user?: string;
    database?: string;
    password?: string;
    port?: number;
    min?: number;
    max?: number;
    idleTimeoutMillis?: number;
  }
}

export = Pool;
