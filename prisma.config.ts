import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const buildDatabaseUrl = () => {
  const dbHost = env("DATABASE_HOST");
  const dbPort = env("DATABASE_PORT");
  const dbUser = env("DATABASE_USER");
  const dbPassword = env("DATABASE_PASSWORD");
  const dbName = env("DATABASE_NAME");
  const dbSchema = env("DATABASE_SCHEMA");

  // DATABASE_URL이 직접 설정되어 있으면 그것을 사용
  if (process.env.DATABASE_URL) {
    return env("DATABASE_URL");
  }

  // 그렇지 않으면 개별 환경변수로 조합
  return `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=${dbSchema}`;
};

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: buildDatabaseUrl(),
  },
});
