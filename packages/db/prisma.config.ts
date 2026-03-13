import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Not required for `prisma generate`. Set DATABASE_URL in your shell
    // or the consuming app's .env when running migrate / db push.
    url: process.env.DATABASE_URL ?? 'file:./dev.db',
  },
});
