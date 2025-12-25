import "dotenv/config";
import { Secret } from "jsonwebtoken";

export const ENV = {
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as Secret,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN  as string,
};

if (!ENV.DATABASE_URL) {
  throw new Error("DATABASE_URL no esta definida");
}
if (!ENV.JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido");
}
if (!ENV.JWT_EXPIRES_IN) {
  throw new Error("JWT_EXPIRES_IN no está definido");
}