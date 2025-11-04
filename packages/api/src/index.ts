import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "../../../generated/prisma/index.js";

const prisma = new PrismaClient();

// Database connection test
async function testDatabaseConnection() {
  try {
    console.log("Testing database connection...");
    await prisma.$connect();
    console.log("✓ Database connected successfully");

    // Test a simple query
    const userCount = await prisma.users.count();
    console.log(`✓ Database query successful - Users count: ${userCount}`);

    return true;
  } catch (error) {
    console.error("✗ Database connection failed:", error);
    return false;
  }
}

const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/db-health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, database: "connected" });
  } catch (error) {
    res.status(503).json({
      ok: false,
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

const PORT = process.env.PORT ?? 3001;

// Test DB connection before starting server
testDatabaseConnection().then((connected) => {
  if (!connected) {
    console.warn("⚠ Server starting without database connection");
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});
