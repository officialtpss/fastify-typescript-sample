import { FastifyReply, FastifyRequest } from "fastify";
import { prismaMock } from '../src/config/singleton';
import userController from "../src/controllers/user.controller";


jest.mock("./../src/middleware/jwt.validator", () => ({
    __esModule: true,
    jwtEncode: jest.fn(() =>
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtyaXNoYW5AZ21haWwuY29tIiwiaWQiOiI2NWJhMGE3NzE2YWFhZjg2MTZmYTRiMDAiLCJpYXQiOjE3MDY2OTQ3MDMsImV4cCI6MTcwNzI5OTUwM30.q24KDliZ7Le7r98N5EHPQtX2CCAZBo2Zk7IkyFdufSk"),
    JWT_SECRET: '123'
}));

describe("User Controller Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a new user", async () => {
            const mockRequest = {
                body: {
                    firstName: "Krishan",
                    lastName: "Kumar",
                    email: "krishan@tech-prastish.com",
                    password: "password123"
                },
            };
            const mockReply = {
                code: jest.fn(() => mockReply),
                send: jest.fn(),
            } as unknown as FastifyReply;

            await userController.create(mockRequest as unknown as FastifyRequest, mockReply as FastifyReply);

            expect(prismaMock.user.create).toHaveBeenCalledWith({
                data: {
                    firstName: "Krishan",
                    lastName: "Kumar",
                    email: "krishan@tech-prastish.com",
                    password: expect.any(String),
                },
                select: {
                    email: true,
                    id: true,
                },
            });
            expect(mockReply.code).toHaveBeenCalledWith(201);
            expect(mockReply.send).toHaveBeenCalledWith({ token: expect.any(String) });
        });

        it("should handle errors when creating a user", async () => {
            const mockRequest = {
                body: {
                    firstName: "Krishan",
                    lastName: "Kumar",
                    email: "krishan@tech-prastish.com",
                    password: "password123",
                },
            };
            const mockReply = {
                code: jest.fn(() => mockReply),
                send: jest.fn(),
            } as unknown as FastifyReply;

            const mockCreate = jest.fn().mockRejectedValue(new Error("User already exists"));
            prismaMock.user.create.mockImplementation(mockCreate);

            await userController.create(mockRequest as unknown as FastifyRequest, mockReply);

            expect(mockReply.code).toHaveBeenCalledWith(400);
            expect(mockReply.send).toHaveBeenCalledWith({ message: expect.any(String) });
        });
    });

    describe("login", () => {
        it("should log in the user", async () => {
            const mockRequest = {
                body: {
                    email: "krishan@tech-prastish.com",
                    password: "password123",
                },
            };
            const mockReply = {
                code: jest.fn(() => mockReply),
                send: jest.fn(),
            } as unknown as FastifyReply;

            const mockFindFirst = jest.fn().mockResolvedValue({
                id: "1",
                email: "krishan@tech-prastish.com",
            });
            prismaMock.user.findFirst.mockImplementation(mockFindFirst);

            await userController.login(mockRequest as unknown as FastifyRequest, mockReply);

            expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
                where: {
                    email: "krishan@tech-prastish.com",
                    password: expect.any(String),
                },
                select: {
                    email: true,
                    id: true,
                },
            });

            expect(mockReply.code).toHaveBeenCalledWith(201);
            expect(mockReply.send).toHaveBeenCalledWith({ token: expect.any(String) });
        });

        it("should handle login errors", async () => {
            const mockRequest = {
                body: {
                    email: "krishan@tech-prastish.com",
                    password: "password123",
                },
            };
            const mockReply = {
                code: jest.fn(() => mockReply),
                send: jest.fn(),
            } as unknown as FastifyReply;

            const mockFindFirst = jest.fn().mockResolvedValue(null);
            prismaMock.user.findFirst.mockImplementation(mockFindFirst);

            await userController.login(mockRequest as unknown as FastifyRequest, mockReply);

            expect(mockReply.code).toHaveBeenCalledWith(400);
            expect(mockReply.send).toHaveBeenCalledWith({ message: expect.any(String) });
        });
    });

    describe("getProfile", () => {
        it("should get the user profile", async () => {
            const mockRequest = {
                userId: "1",
            };
            const mockReply = {
                code: jest.fn(() => mockReply),
                send: jest.fn(),
            } as unknown as FastifyReply;

            const mockFindFirst = jest.fn().mockResolvedValue({
                email: "krishan@tech-prastish.com",
                firstName: "Krishan",
                lastName: "Kumar",
            });
            prismaMock.user.findFirst.mockImplementation(mockFindFirst);

            await userController.getProfile(mockRequest as unknown as FastifyRequest, mockReply);

            expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
                where: { id: "1" },
                select: {
                    email: true,
                    firstName: true,
                    lastName: true,
                },
            });

            expect(mockReply.code).toHaveBeenCalledWith(200);
            expect(mockReply.send).toHaveBeenCalledWith({
                email: "krishan@tech-prastish.com",
                firstName: "Krishan",
                lastName: "Kumar",
            });
        });

        it("should handle errors when getting user profile", async () => {
            const mockRequest = {
                userId: "1",
            };
            const mockReply = {
                code: jest.fn(() => mockReply),
                send: jest.fn(),
            } as unknown as FastifyReply;

            const mockFindFirst = jest.fn().mockRejectedValue(new Error("Database error"));
            prismaMock.user.findFirst.mockImplementation(mockFindFirst);

            await userController.getProfile(mockRequest as unknown as FastifyRequest, mockReply);

            expect(mockReply.code).toHaveBeenCalledWith(400);
            expect(mockReply.send).toHaveBeenCalledWith({ message: expect.any(String) });
        });
    });

    describe("updateProfile", () => {
        it("should update the user profile", async () => {
            const mockRequest = {
                userId: "1",
                body: {
                    firstName: "Krish",
                    lastName: "Thakur",
                },
            };
            const mockReply = {
                code: jest.fn(() => mockReply),
                send: jest.fn(),
            } as unknown as FastifyReply;

            const mockUpdate = jest.fn().mockResolvedValue({});
            prismaMock.user.update.mockImplementation(mockUpdate);

            await userController.updateProfile(mockRequest as unknown as FastifyRequest, mockReply);

            expect(prismaMock.user.update).toHaveBeenCalledWith({
                where: { id: "1" },
                data: {
                    firstName: "Krish",
                    lastName: "Thakur",
                },
            });

            expect(mockReply.code).toHaveBeenCalledWith(204);
            expect(mockReply.send).toHaveBeenCalledWith();
        });

        it("should handle errors when updating user profile", async () => {
            const mockRequest = {
                userId: "1",
                body: {
                    firstName: "Krish",
                    lastName: "Thakur",
                },
            };
            const mockReply = {
                code: jest.fn(() => mockReply),
                send: jest.fn(),
            } as unknown as FastifyReply;

            const mockUpdate = jest.fn().mockRejectedValue(new Error("Database error"));
            prismaMock.user.update.mockImplementation(mockUpdate);

            await userController.updateProfile(mockRequest as unknown as FastifyRequest, mockReply);

            expect(mockReply.code).toHaveBeenCalledWith(400);
            expect(mockReply.send).toHaveBeenCalledWith({ message: expect.any(String) });
        });
    });

    describe("deleteProfile", () => {
        it("should delete the user profile", async () => {
            const mockRequest = {
                userId: "1",
            };
            const mockReply = {
                code: jest.fn(() => mockReply),
                send: jest.fn(),
            } as unknown as FastifyReply;

            const mockDelete = jest.fn().mockResolvedValue({});
            prismaMock.user.delete.mockImplementation(mockDelete);

            await userController.deleteProfile(mockRequest as unknown as FastifyRequest, mockReply);

            expect(prismaMock.user.delete).toHaveBeenCalledWith({
                where: { id: "1" },
            });

            expect(mockReply.code).toHaveBeenCalledWith(200);
            expect(mockReply.send).toHaveBeenCalledWith({ message: expect.any(String) });
        });

        it("should handle errors when deleting user profile", async () => {
            const mockRequest = {
                userId: "1",
            };
            const mockReply = {
                code: jest.fn(() => mockReply),
                send: jest.fn(),
            } as unknown as FastifyReply;

            const mockDelete = jest.fn().mockRejectedValue(new Error("Database error"));
            prismaMock.user.delete.mockImplementation(mockDelete);

            await userController.deleteProfile(mockRequest as unknown as FastifyRequest, mockReply);

            expect(mockReply.code).toHaveBeenCalledWith(400);
            expect(mockReply.send).toHaveBeenCalledWith({ message: expect.any(String) });
        });
    });
});