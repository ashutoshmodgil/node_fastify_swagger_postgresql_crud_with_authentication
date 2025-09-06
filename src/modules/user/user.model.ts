import { Static } from "@sinclair/typebox";
import { userSchemaMongoose, userSchemaPostgres } from "./user.schema";

export interface UserDTO {
  name: string;
  email: string;
  password: string;
}
export interface User extends UserDTO {
  id: number;
}

export interface UserResponse{
  name: string;
}

export type UserDTOPostgres = Static<typeof userSchemaPostgres>;

export type UserDTOMongoose = Static<typeof userSchemaMongoose>;
