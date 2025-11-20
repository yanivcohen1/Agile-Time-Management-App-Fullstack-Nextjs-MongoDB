import { PrismaClient } from "@prisma/client";
import { env } from "./env";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const datasourceUrl = env.prismaEngineEndpoint ?? env.databaseUrl;

const prismaClientSingleton = () =>
  new PrismaClient({
    datasourceUrl,
    log: env.nodeEnv === "development" ? ["error", "warn"] : ["error"]
  });

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (env.nodeEnv !== "production") {
  globalForPrisma.prisma = prisma;
}
