import { EventEmitter } from "events"
import { Writable, Readable } from "stream"
import { Pool as GenericPool } from "generic-pool"
import { TlsOptions } from "tls"
import { Promise } from "es6-promise"

interface QueryCallback {
  (err: Error, result: ResultSet): void;
}

interface ClientConnectCallback {
  (err: Error, client: Client): void;
}

interface ConnectCallback {
  (err: Error, client: Client, done: Done): void;
}

interface Done {
  (): void;
}

interface ResultSet {
  rows: any[];
}

interface QueryConfig {
  name?: string;
  text: string;
  values?: any[];
}

interface Config {
  host?: string;
  user?: string;
  database?: string;
  password?: string;
  port?: number;
  poolSize?: number;
  rows?: number;
  binary?: boolean;
  poolIdleTimeout?: number;
  reapIntervalMillis?: number;
  poolLog?: boolean;
  client_encoding?: string;
  ssl?: TlsOptions;
  application_name?: string;
  fallback_application_name?: string;
  parseInputDatesAsUTC?: boolean;
}

interface PoolOptions {
  host?: string;
  user?: string;
  database?: string;
  password?: string;
  port?: number;
  min?: number;
  max?: number;
  idleTimeoutMillis?: number;
}

interface ResultBuilder {
  command: string;
  rowCount: number;
  oid: number;
  rows: any[];
  addRow(row: any): void;
}

interface Query extends EventEmitter {
  text: string;
  values: any[];

  on(event: "row", listener: (row: any, result: ResultBuilder) => void): this;
  on(event: "end", listener: (result: ResultBuilder) => void): this;
  on(event: "error", listener: (err: Error) => void): this;
  on(event: string, listener: Function): this;
}

interface Client extends EventEmitter {
  user: string;
  database: string;
  port: string;
  host: string;
  password: string;
  binary: boolean;
  encoding: string;
  ssl: boolean;

  query(query: QueryConfig, callback?: QueryCallback): Query;
  query(text: string, callback: QueryCallback): Query;
  query(text: string, values: any[], callback: QueryCallback): Query;

  connect(callback: ClientConnectCallback): void;
  end(): void;

  pauseDrain(): void;
  resumeDrain(): void;

  on(event: "drain", listener: () => void): this;
  on(event: "error", listener: (err: Error) => void): this;
  on(event: "notification", listener: (message: any) => void): this;
  on(event: "notice", listener: (message: any) => void): this;
  on(event: string, listener: Function): this;
}

export = class Pool extends EventEmitter {
  constructor(options: PoolOptions, Client?: new (connection: string | Config) => Client);
  connect(cb: ConnectCallback): Promise<Client>;
  take(cb: ConnectCallback): Promise<Client>;
  query(query: QueryConfig, callback?: QueryCallback): Promise<Query>;
  query(text: string, callback: QueryCallback): Promise<Query>;
  query(text: string, values: any[], callback: QueryCallback): Promise<Query>;
  end(cb: Done): Promise<void>;

  on(event: "connect", listener: (client: Client) => void): this;
  on(event: "acquire", listener: (client: Client) => void): this;
  on(event: "error", listener: (err: Error) => void): this;
  on(event: string, listener: Function): this;
}
