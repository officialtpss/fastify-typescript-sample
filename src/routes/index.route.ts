import { FastifyInstance } from "fastify";
import { userRoutes } from "./user.route";
export const IndexRoutes = (app: FastifyInstance) => {
    userRoutes(app)
}
