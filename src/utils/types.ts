import { FastifyInstance } from "fastify";
import mongoose from "mongoose";

declare module "fastify" {
    interface FastifyInstance {
        db: FastifyDbHybrid;
        // Mongoose integration
        mongoose: typeof mongoose;
        io: any; // Socket.IO instance
    }
}


export interface FastifyDbHybrid  extends FastifyInstance{
    query: <T = any>(text: string, params?: any[]) => Promise<T[]>;
    collection: <T = any>(name: string) => {
        find: () => T[];
        insertOne: (data: T) => Promise<{ insertedId: string }>;
    };
}