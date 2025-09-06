import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getEmailDb } from "../auth/auth.repository";
import { User, UserDTO } from "./user.model";
import { createUser, deleteUser, getAllUsers, updateUser, UserModel } from "./user.repository";

export async function listUsersPostgres(fastify: FastifyInstance, request: FastifyRequest, reply: FastifyReply) {
  const users = await getAllUsers(fastify.db);
  reply.send(users);
}

export async function addUserPostgres(
  fastify: FastifyInstance,
  request: FastifyRequest<{ Body: UserDTO }>,
  reply: FastifyReply
) {
  const emailExists = await getEmailDb(fastify.db, request.body);
  if (emailExists) {
    reply.code(409).send({ error: "Email already exists" });
    return;
  }
  const user = await createUser(fastify.db, request.body);
  reply.code(201).send(user);
}

export async function updateUserPostgres(
  fastify: FastifyInstance,
  request: FastifyRequest<{ Body: User }>,
  reply: FastifyReply
) {
  const user = await updateUser(fastify.db, request.body);
  reply.code(200).send(user);
}
export async function deleteUserPostgres(
  fastify: FastifyInstance,
  request: FastifyRequest<{ Body: { id: number } }>,
  reply: FastifyReply
) {
  const user = await deleteUser(fastify.db, request.body.id);
  reply.code(204).send();
}

export async function listUsersMongoose(fastify: FastifyInstance, request: FastifyRequest, reply: FastifyReply) {
  const users = await UserModel.find().exec();
  reply.send(users);
}

export async function addUserMongoose(
  fastify: FastifyInstance,
  request: FastifyRequest<{ Body: UserDTO }>,
  reply: FastifyReply
) {
  try {
    const user = new UserModel(request.body);
    const savedUser = await user.save();
    reply.code(201).send(savedUser);
  } catch (err) {
    reply.code(400).send({ error: (err as Error).message });
  }
}