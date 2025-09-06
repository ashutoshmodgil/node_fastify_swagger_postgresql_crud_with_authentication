import { FastifyInstance, FastifyRequest } from "fastify";
import { login } from "./auth.controller";
import { ILogin } from "./auth.model";
import { authSchema } from "./auth.schema";

export async function authRoutes(fastify: FastifyInstance) {

    fastify.post("/login", { schema: { body: authSchema } }, async (request: FastifyRequest<{ Body: ILogin }>, reply) => {
        await login(fastify,request, reply);
    });

}