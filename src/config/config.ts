import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: ".env" });
const CUSTOM_PORT: string = (process.env.PORT || 3000)?.toString();
export const CONF_ENV: string = process.env.CONF_ENV || "local";
export const PORT: number = parseInt(CUSTOM_PORT, 10);
export const ROOT = path.normalize(__dirname + "/.."); // Root path of server
export const LOG_LEVEL: string = process.env.LOG_LEVEL || "debug";

export const SECRET_KEY = process.env.JWT_SECRET ?? '';
export const JWT_SECRET = process.env.JWT_SECRET ?? '';
export const SERVER_URL = process.env.SERVER_URL || `localhost:${PORT}`;
export const SWAGGER_APP_NAME = process.env.SWAGGER_APP_NAME;
export const SWAGGER_CONTACT_MAIL = process.env.SWAGGER_CONTACT_MAIL;
export const SWAGGER_VERSION = process.env.SWAGGER_VERSION ?? '0.1.0';
export const SWAGGER_DESC = process.env.SWAGGER_DESC ?? '';