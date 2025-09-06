import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends FastifyRequest {
  user?: any; // Define the user property to hold decoded token data
}

const secretKey = 'key';
const refreshTokenSecretKey = 'refresh-key';

export const authenticateToken = (req: AuthenticatedRequest, res: FastifyReply, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

  if (!token) {
    return res.code(401).send({ message: 'Authentication token required.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey as string);
    req.user = decoded; // Attach decoded user data to the request object
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return res.code(403).send({ message: error });
  }

};

export const generateToken = (username:string) => {
  const token = jwt.sign({
    name: username,
  }, secretKey, {
    expiresIn: '1h' // token expires in 1 hour
  });
  return token;
}

export const generateRefreshToken = (token:string) => {
  const refreshToken = jwt.sign({
    token: token,
  }, refreshTokenSecretKey, {
    expiresIn: '1d' // refresh token expires in 1 day
  });
  return refreshToken;
}
