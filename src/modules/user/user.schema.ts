import { Type } from '@sinclair/typebox';

export const userSchemaPostgres = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 })
});

export const userSchemaMongoose = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 })
});