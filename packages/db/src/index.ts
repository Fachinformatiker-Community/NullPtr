import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/client/client.js';

// ---------------------------------------------------------------------------
// Singleton – reuses one instance across hot-reloads
// ---------------------------------------------------------------------------
declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});

export const db: PrismaClient = (globalThis.__prismaClient ??= new PrismaClient({ adapter }));

export * from '../generated/client/client.js';
export default db;
