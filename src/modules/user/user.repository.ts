import { model, Schema } from "mongoose";
import { FastifyDbHybrid } from "../../utils/types";
import { User, UserDTO, UserResponse } from "./user.model";


export async function getAllUsers(db: FastifyDbHybrid): Promise<User[]> {

//     SELECT
//     film_id,
//     title
// FROM
//     film
// ORDER BY
//     title
// OFFSET 5 ROWS
    // FETCH FIRST 10 ROW ONLY;
    
    let response = await db.query<User>("SELECT * FROM public.user");
    return response
}

export async function createUser(db: FastifyDbHybrid, data: UserDTO): Promise<UserResponse> {
    const result = await db.query<UserResponse>(
        "INSERT INTO public.user (name, email, password) VALUES ($1, $2, $3) RETURNING name",
        [data.name, data.email, data.password]
    );
    return {
        name: result[0].name,
    };
}

export async function updateUser(db: FastifyDbHybrid, data: User): Promise<User> {
    const result = await db.query<User>(
        "UPDATE public.user SET name=$1, email=$2 WHERE id=$3 RETURNING *",
        [data.name, data.email, data.id]
    );
    return result[0];
}

export async function deleteUser(db: FastifyDbHybrid, id: number): Promise<User> {
    const result = await db.query<User>(
        "DELETE FROM public.user WHERE id=$1 RETURNING *",
        [id]
    );
    return result[0];
}

export async function getAllUsersMongoose(db: FastifyDbHybrid): Promise<User[]> {
    return await db.collection<User>("users").find();
}

export async function createUserMongoose(
    db: FastifyDbHybrid,
    data: User
): Promise<(User & { _id: any })[]> {
    const result = await db.collection<User>("user").insertOne(data);
    return [{ ...data, _id: result.insertedId }];
}

const userSchema = new Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

export const UserModel = model<User>("user", userSchema);
