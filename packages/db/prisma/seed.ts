import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/client/client.js';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const db = new PrismaClient({ adapter });

async function main(): Promise<void> {
  // ── Roles ──────────────────────────────────────────────────────────────────
  const roles = ['Developer', 'Admin', 'Moderator', 'Uploader', 'User'];

  for (const name of roles) {
    await db.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log(`✔ Seeded ${roles.length} roles: ${roles.join(', ')}`);

  // ── Platforms ──────────────────────────────────────────────────────────────
  const platforms = ['discord', 'telegram'];

  for (const name of platforms) {
    await db.platform.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log(`✔ Seeded ${platforms.length} platforms: ${platforms.join(', ')}`);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
