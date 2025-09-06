import { FastifyDbHybrid } from "../../utils/types";
import { User, UserResponse } from "../user/user.model";
import { ILogin } from "./auth.model";
export async function loginDb(db: FastifyDbHybrid,data: ILogin): Promise<UserResponse> {
  let response = await db.query<User>("SELECT * FROM public.user WHERE email = $1 AND password = $2", [data.email, data.password]);
  return response[0];
}

export async function getEmailDb(db: FastifyDbHybrid,data: ILogin): Promise<number> {
  let response = await db.query<{ count: number }>("SELECT COUNT(*) FROM public.user WHERE email = $1", [data.email]);
  return response[0].count;
}

export async function addTokenDb(db: FastifyDbHybrid, data: { refreshToken: string; accessToken: string; email: string }): Promise<number> {
  let response = await db.query<{ id: number }>("UPDATE public.user SET refresh_token = $1, access_token = $2 WHERE email = $3 RETURNING id", [data.refreshToken, data.accessToken, data.email]);
  return response[0].id;
}