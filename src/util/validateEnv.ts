import { cleanEnv, port, str } from "envalid";
import { Secret } from "jsonwebtoken";

export default cleanEnv(process.env, {
  MONGO_URI: str(),
  PORT: port(),
});

// env.ts
function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const JWT_SECRET = getEnvVariable("JWT_SECRET");
export const REFRESH_SECRET = getEnvVariable("REFRESH_SECRET");