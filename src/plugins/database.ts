import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { MongoClient } from "mongodb";
import pg from "pg";

const { Pool } = pg;

export const fpPostgreSql = fp(async (fastify: FastifyInstance) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // ssl: { rejectUnauthorized: false }
  });
 
  fastify.decorate("db", {
    query: async <T = any>(text: string, params?: any[]): Promise<T[]> => {
      const result = await pool.query(text, params);
      return result.rows as T[];
    },
  } as any);
});


export const fpMongoose =  fp(async (fastify: FastifyInstance) => {
  const client = new MongoClient(process.env.MONGO_URL!);
  await client.connect();
  fastify.decorate("mongo", client.db(process.env.MONGO_DB_NAME!));
});