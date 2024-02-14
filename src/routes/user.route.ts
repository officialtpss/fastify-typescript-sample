import { FastifyInstance } from "fastify";
import UserController from "../controllers/user.controller";
import validator from "../middleware/schema.validator";
import { authenticate } from './../middleware/jwt.validator';

const userSchema = {
    type: 'object', 
    properties: {
        firstName: { type: 'string', minLength: 3, maxLength: 30 },
        lastName: { type: 'string', minLength: 3, maxLength: 30 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8, maxLength: 20 }
    },
    required: ['firstName', 'email', 'lastName', 'password'],
    additionalProperties: false,
};
const loginSchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8, maxLength: 20 }
    },
    required: ['email', 'password']
};
export const userRoutes = (app: FastifyInstance) => {
    app.route({
        method: 'POST',
        url: '/user',
        schema: {
            body: {
                type: 'object',
                properties: {
                    firstName: { type: 'string', minLength: 3, maxLength: 30 },
                    lastName: { type: 'string', minLength: 3, maxLength: 30 },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8, maxLength: 20 }
                },
                required: ['firstName', 'email', 'lastName', 'password'],
                additionalProperties: false,
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string',
                        }
                    },
                }
            }
        },
        config: {
            openapi: {
                description: 'Create a user',
                summary: 'Create user',
                tags: ['User']
            }
        },
        preHandler: validator(userSchema), // Assuming you have the validator middleware
        handler: UserController.create,
    });

    app.route({
        method: 'POST',
        url: '/user/login',
        schema: {
            body: loginSchema,
            response: {
                200: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string',
                        }
                    },
                }
            }
        },
        config: {
            openapi: {
                description: 'Login user by email and password',
                summary: 'Login user',
                tags: ['User']
            }
        },
        preHandler: validator(loginSchema), // Assuming you have the validator middleware
        handler: UserController.login,
    });

    app.route({
        method: 'GET',
        url: '/user',
        schema: {
            response: {
                200: {
                    type: 'object',
                    description: 'The response payload',
                    properties: {
                        email: {
                            type: 'string',
                            description: 'user email'
                        },
                        firstName: {
                            type: 'string',
                            description: 'first name'
                        },
                        lastName: {
                            type: 'string',
                            description: 'last name'
                        }
                    },
                },
            }
        },
        config: {
            openapi: {
                description: 'Get user profile',
                summary: 'Get user',
                tags: ['User'],
                security: [{ bearerAuth: [] }]
            }
        },
        preHandler: authenticate,
        handler: UserController.getProfile,
    });

    app.route({
        method: 'PATCH',
        url: '/user',
        schema: {
            body: {
                type: 'object',
                properties: {
                    firstName: { type: 'string', minLength: 3, maxLength: 30 },
                    lastName: { type: 'string', minLength: 3, maxLength: 30 },
                }
            },
            response: {
                204: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                        }
                    },
                },
            }
        },
        config: {
            openapi: {
                description: 'Update profile',
                summary: 'Update user',
                tags: ['User'],
                security: [{ bearerAuth: [] }]
            }
        },
        preHandler: [authenticate, validator(
            {
                type: 'object',
                properties: {
                    firstName: { type: 'string', minLength: 3, maxLength: 30 },
                    lastName: { type: 'string', minLength: 3, maxLength: 30 },
                }
            }
        )],
        handler: UserController.updateProfile,
    });

    app.route({
        method: 'DELETE',
        url: '/user',
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                        }
                    },
                },
            }
        },
        config: {
            openapi: {
                description: 'Delete user profile',
                summary: 'Delete user',
                tags: ['User'],
                security: [{ bearerAuth: [] }]
            }
        },
        preHandler: authenticate, // Assuming you have the validator middleware
        handler: UserController.deleteProfile,
    });

};
