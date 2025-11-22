import { PrismaClient } from "../../../../generated/prisma/index";

// PrismaClient singleton pattern
// This ensures only one instance is created and shared across the application

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    // Connection pool configuration
    // Adjust based on your database server's max connections and expected load
    // datasources: {
    //   db: {
    //     url: process.env.DATABASE_URL,
    //   },
    // },
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Graceful shutdown helper
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

export default prisma;
