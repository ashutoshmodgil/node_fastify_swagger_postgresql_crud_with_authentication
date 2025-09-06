import { FastifyInstance, FastifyRequest } from "fastify";
import { authenticateToken } from "../../middlewares/authenticationMiddleware";
import { addUserMongoose, addUserPostgres, listUsersMongoose, listUsersPostgres } from "./user.controller";
import { UserDTO } from "./user.model";
import { userSchemaMongoose, userSchemaPostgres } from "./user.schema";


export async function userRoutesPostgres(fastify: FastifyInstance) {
    fastify.get("/list", { preHandler: authenticateToken }, async (request, reply) => {
        await listUsersPostgres(fastify, request, reply);
    });

    fastify.post("/", { schema: { body: userSchemaPostgres } }, async (request: FastifyRequest<{ Body: UserDTO }>, reply) => {
        await addUserPostgres(fastify, request, reply);
    });

    fastify.get("/", { preHandler: authenticateToken }, async () => {
        return { message: 'Fastify + MongoDB Atlas with TypeScript is working!' };
    });
}

export async function userRoutesMongoose(fastify: FastifyInstance) {
    fastify.get("/usersMongoose", async (request, reply) => {
        await listUsersMongoose(fastify, request, reply);
    });

    fastify.post("/usersMongoose", { schema: { body: userSchemaMongoose } }, async (request: FastifyRequest<{ Body: UserDTO }>, reply) => {
        await addUserMongoose(fastify, request, reply);
    });
}