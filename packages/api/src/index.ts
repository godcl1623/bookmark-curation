import "dotenv/config";
import express from "express";
import cors from "cors";
import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import prisma, { disconnectPrisma } from "./lib/prisma";
import bookmarksRouter from "./routes/bookmarks";
import foldersRouter from "./routes/folders";
import tagsRouter from "./routes/tags";
import directoryRouter from "./routes/directory";
import usersRouter from "./routes/users";

// Handle BigInt serialization for JSON
BigInt.prototype.toJSON = function () {
  return Number(this);
};

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

app.get(SERVICE_ENDPOINTS.HEALTH_CHECK.SERVER.path, (_req, res) => {
  res.json({ ok: true });
});

app.get(SERVICE_ENDPOINTS.HEALTH_CHECK.DB.path, async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, database: "connected" });
  } catch (error) {
    res.status(503).json({
      ok: false,
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// API Routes
app.use(usersRouter);
app.use(bookmarksRouter);
app.use(foldersRouter);
app.use(tagsRouter);
app.use(directoryRouter);

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
  await disconnectPrisma();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down gracefully...");
  await disconnectPrisma();
  process.exit(0);
});
