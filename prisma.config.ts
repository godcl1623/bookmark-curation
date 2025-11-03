import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const buildDatabaseUrl = () => {
  const host = env("DATABASE_HOST");
  const port = env("DATABASE_PORT");
  const user = env("DATABASE_USER");
  const password = env("DATABASE_PASSWORD");
  const name = env("DATABASE_NAME");

  // DATABASE_URL이 직접 설정되어 있으면 그것을 사용
  if (process.env.DATABASE_URL) {
    return env("DATABASE_URL");
  }

  // 그렇지 않으면 개별 환경변수로 조합
  return `postgresql://${user}:${password}@${host}:${port}/${name}`;
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
