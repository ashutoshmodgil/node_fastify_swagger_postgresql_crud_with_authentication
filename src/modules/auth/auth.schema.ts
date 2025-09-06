import { Static, Type } from '@sinclair/typebox';

export const authSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 })
});

export type UserDTOPostgres = Static<typeof authSchema>;

