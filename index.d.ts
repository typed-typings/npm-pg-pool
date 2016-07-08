import { EventEmitter } from "events"
import { Writable, Readable } from "stream"
import { Pool as GenericPool } from "generic-pool"
import { TlsOptions } from "tls"
import { Promise } from "es6-promise"
import * as pg from "pg"

declare class PgPool extends EventEmitter {
  constructor(options: PgPool.PoolOptions, Client?: new (connection: string | pg.Config) => pg.Client);
  connect(cb?: pg.ConnectCallback): Promise<pg.Client>;
  take(cb?: pg.ConnectCallback): Promise<pg.Client>;
  query(query: pg.QueryConfig, callback?: pg.QueryCallback): Promise<pg.ResultSet>;
  query(text: string, callback?: pg.QueryCallback): Promise<pg.ResultSet>;
  query(text: string, values: any[], callback?: pg.QueryCallback): Promise<pg.ResultSet>;
  end(cb: pg.Done): Promise<void>;

  on(event: "connect", listener: (client: pg.Client) => void): this;
  on(event: "acquire", listener: (client: pg.Client) => void): this;
  on(event: "error", listener: (err: Error) => void): this;
  on(event: string, listener: Function): this;
}

declare namespace PgPool {

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

export = PgPool;
