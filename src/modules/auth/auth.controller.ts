import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { generateRefreshToken, generateToken } from "../../middlewares/authenticationMiddleware";
import { ILogin } from "./auth.model";
import { addTokenDb, loginDb } from "./auth.repository";

export async function login(
  fastify: FastifyInstance,
  request: FastifyRequest<{ Body: ILogin }>,
  reply: FastifyReply
) {
  const user = await loginDb(fastify.db, request.body);
  if (!user) {
    reply.code(401).send({ error: "Invalid email or password" });
    return;
  }
  else {
    const token = generateToken(user.name);
    const refreshToken = generateRefreshToken(token);
    const tokenAdded = await addTokenDb(fastify.db, { refreshToken, accessToken: token, email: request.body.email });
    if(tokenAdded) {
      reply.header('Authorization', `Bearer ${token}`);
      reply.header('x-refresh-token', refreshToken);
      reply.code(200).send({ token, refreshToken });
    } else {
      reply.code(500).send({ error: "Something went wrong" });
    }
  }
}