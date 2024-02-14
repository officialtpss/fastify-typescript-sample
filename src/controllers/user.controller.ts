import { RESPONSE_CODE } from "../Constants/constant";
import { locale } from "../config/locales";
import { FastifyReply, FastifyRequest } from "fastify"
import { encryptPassword } from "../services/CryptoSecurityService";
import { jwtEncode } from "../middleware/jwt.validator";
import prisma from "../config/prisma.config";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    createdAt?: Date;
}

const create = async (request: FastifyRequest | { body: User | any }, reply: FastifyReply) => {
    try {
        request.body.password = encryptPassword(request.body.password);
        const user = await prisma.user.create({
            data: request.body,
            select: {
                email: true,
                id: true,
            }
        });
        const token = jwtEncode(user);
        return reply.code(RESPONSE_CODE.CREATED).send({ token });
    } catch (error: any) {
        if (error?.meta?.target == 'User_email_key') {
            return reply.code(RESPONSE_CODE.BAD_REQUEST).send({ message: locale('USER_EMAIL_EXIST') });
        }
        return reply.code(RESPONSE_CODE.BAD_REQUEST).send({ message: locale('SERVER_ERROR') });
    }
}

const login = async (request: FastifyRequest | { body: { password: string, email: string } | any }, reply: FastifyReply) => {
    try {
        request.body.password = encryptPassword(request.body.password);
        const user = await prisma.user.findFirst({
            where: request.body,
            select: {
                email: true,
                id: true,
            },
        });
        if (user) {
            const token = await jwtEncode(user);
            return reply.code(RESPONSE_CODE.CREATED).send({ token });
        }
        return reply.code(RESPONSE_CODE.BAD_REQUEST).send({ message: locale('CREDENTIAL_NOT_MATCH') });
    } catch (error: any) {
        return reply.code(RESPONSE_CODE.BAD_REQUEST).send({ message: locale('SERVER_ERROR') });
    }
}

const getProfile = async (request: FastifyRequest | any, reply: FastifyReply) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: request.userId
            },
            select: {
                email: true,
                firstName: true,
                lastName: true
            },
        });
        return reply.code(RESPONSE_CODE.SUCCESS).send(user);
    } catch (error: any) {
        return reply.code(RESPONSE_CODE.BAD_REQUEST).send({ message: locale('SERVER_ERROR') });
    }
}

const updateProfile = async (request: FastifyRequest | any, reply: FastifyReply) => {
    try {
        await prisma.user.update({
            where: {
                id: request.userId
            },
            data: request.body
        });
        reply.code(RESPONSE_CODE.NO_CONTENT_FOUND).send();
    } catch (error: any) {
        reply.code(RESPONSE_CODE.BAD_REQUEST).send({ message: locale('SERVER_ERROR') });
    }
}

const deleteProfile = async (request: FastifyRequest | any, reply: FastifyReply) => {
    try {
        await prisma.user.delete({
            where: {
                id: request.userId
            }
        });
        reply.code(RESPONSE_CODE.SUCCESS).send({ message: locale('USER_DELETE_SUCCESS') });
    } catch (error: any) {
        reply.code(RESPONSE_CODE.BAD_REQUEST).send({ message: locale('SERVER_ERROR') });
    }
}

export default {
    create,
    login,
    getProfile,
    updateProfile,
    deleteProfile
}