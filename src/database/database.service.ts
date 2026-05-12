import { Injectable } from '@nestjs/common';
import { Pool as PgPool } from 'pg';
import postgresQuerysJson from './postgre.querys.json';

@Injectable()
export class DatabaseService {
  private readonly pool: any;

  constructor() {
    this.pool = new PgPool({
      connectionString: process.env.POSTGRESQL_CONNECTION_STRING,
      max: 50,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  async query<T = any>(queryKey: string, params?: any[]): Promise<T> {
    const client = await (this.pool as PgPool).connect();
    try {
      const res = await client.query(
        (postgresQuerysJson as Record<string, string>)[queryKey],
        params,
      );
      return res.rows as T;
    } catch (e) {
      throw e instanceof Error ? e : new Error(String(e));
    } finally {
      client.release();
    }
  }
}
