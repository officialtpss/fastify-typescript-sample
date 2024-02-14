import { RESPONSE_CODE } from "../Constants/constant";
import { FastifyReply, FastifyRequest } from "fastify";
import Ajv, { ErrorObject } from 'ajv';
import addFormats from "ajv-formats"

// Create an instance of Ajv
type Schema = object;

const validator = (schemaObject: Schema) => {
    return async (request: FastifyRequest | any, reply: FastifyReply) => {
        try {
            const payload = {
                ...request.params,
                ...request.query,
                ...request.body
            };
            const ajv = new Ajv();
            addFormats(ajv);
            const valid = ajv.validate(schemaObject, payload);
            if (!valid) {
                const errors = ajv.errors as ErrorObject[];
                const errorMessage = errors.map(error => error.message).join(', ');
                throw { statusCode: RESPONSE_CODE.BAD_REQUEST, message: errorMessage };
            }
        } catch (error: any) {
            reply.code(error.statusCode || RESPONSE_CODE.INTERNAL_SERVER_ERROR).send({ message: error.message });
            return;
        }
    };
};

export default validator;
