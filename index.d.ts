import { EventEmitter } from "events"
import { Writable, Readable } from "stream"
import { Pool as GenericPool } from "generic-pool"
import { TlsOptions } from "tls"
import { Promise } from "es6-promise"

declare class PgPool extends EventEmitter {
  constructor(options: PgPool.PoolOptions, Client?: new (connection: string | PgPool.Config) => PgPool.Client);
  connect(cb?: PgPool.ConnectCallback): Promise<PgPool.Client>;
  take(cb: PgPool.ConnectCallback): Promise<PgPool.Client>;
  query(query: PgPool.QueryConfig, callback?: PgPool.QueryCallback): Promise<PgPool.ResultSet>;
  query(text: string, callback: PgPool.QueryCallback): Promise<PgPool.ResultSet>;
  query(text: string, values: any[], callback: PgPool.QueryCallback): Promise<PgPool.ResultSet>;
  end(cb: PgPool.Done): Promise<void>;

  on(event: "connect", listener: (client: PgPool.Client) => void): this;
  on(event: "acquire", listener: (client: PgPool.Client) => void): this;
  on(event: "error", listener: (err: Error) => void): this;
  on(event: string, listener: Function): this;
}

declare namespace PgPool {

  export interface QueryCallback {
    (err: Error, result: ResultSet): void;
  }

  export interface ClientConnectCallback {
    (err: Error, client: Client): void;
  }

  export interface ConnectCallback {
    (err: Error, client: Client, done: Done): void;
  }

  export interface Done {
    (): void;
  }

  export interface ResultSet {
    rows: any[];
  }

  export interface QueryConfig {
    name?: string;
    text: string;
    values?: any[];
  }

  export interface Config {
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

  export interface ResultBuilder {
    command: string;
    rowCount: number;
    oid: number;
    rows: any[];
    addRow(row: any): void;
  }

  export interface Query extends EventEmitter, Promise<ResultSet> {
    text: string;
    values: any[];

    on(event: "row", listener: (row: any, result: ResultBuilder) => void): this;
    on(event: "end", listener: (result: ResultBuilder) => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: string, listener: Function): this;
  }

  export interface Client extends EventEmitter {
    user: string;
    database: string;
    port: string;
    host: string;
    password: string;
    binary: boolean;
    encoding: string;
    ssl: boolean;

    connect(callback?: ClientConnectCallback): void;

    getStartupConf(): Config;

    cancel(client: Client, query: Query): void;

    setTypeParser(oid: any, format: any, parseFn: any): any; // TODO
    getTypeParser(oid: any, format: any): any; // TODO

    escapeIdentifier(str: string): string;
    escapeLiteral(str: string): string;

    copyFrom(text: string): any // TODO
    copyTo(text: string): any // TODO

    query(query: QueryConfig, callback?: QueryCallback): Promise<ResultSet>;
    query(text: string, callback?: QueryCallback): Promise<ResultSet>;
    query(text: string, values: any[], callback?: QueryCallback): Promise<ResultSet>;

    end(): void;
    md5(str: string): string;

    release(err?: Error): Promise<Client>

    on(event: "drain", listener: () => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: "notification", listener: (message: any) => void): this;
    on(event: "notice", listener: (message: any) => void): this;
    on(event: string, listener: Function): this;
  }

}

export = PgPool;
