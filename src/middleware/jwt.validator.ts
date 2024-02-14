import { RESPONSE_CODE } from "../Constants/constant";
import { JWT_SECRET } from "../config/config";
import { FastifyReply, FastifyRequest } from "fastify";
import jwt from 'jsonwebtoken';

// Middleware to check bearer token
export const authenticate = (request: FastifyRequest | any, reply: FastifyReply) => {
    return new Promise<void>((resolve, reject) => {
        try {
            const { authorization } = request.headers;
            if (!authorization || !authorization.startsWith('Bearer ')) {
                reply.code(401).send({ message: 'Unauthorized' });
                reject(new Error('Unauthorized'));
                return;
            }

            const token = authorization.slice(7, authorization?.length); // Remove 'Bearer ' prefix
            // Check if token is valid (you can implement your own logic here)
            jwt.verify(token, JWT_SECRET, (err: any, tokenResponse: any) => {
                if (err) {
                    reply.code(RESPONSE_CODE.UNAUTHORIZED).send({ message: 'Unauthorized' });
                    reject(new Error('Unauthorized'));
                } else {
                    request.userId = tokenResponse?.id;
                    request.userEmail = tokenResponse?.email;
                    resolve();
                }
            });
        } catch (error) {
            reply.code(RESPONSE_CODE.UNAUTHORIZED).send({ message: 'Unauthorized' });
            reject(error);
        }
    });
};

export const jwtEncode = (data: {
    [key: string]: string;
}) => {
    const expiresIn = '7d';
    return jwt.sign(data, JWT_SECRET, { expiresIn });
}


export default {
    authenticate,
    jwtEncode
}