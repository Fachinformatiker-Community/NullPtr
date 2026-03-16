import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '../generated/client/client.js';

// ---------------------------------------------------------------------------
// Singleton – reuses one instance across hot-reloads
// ---------------------------------------------------------------------------
declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

// When compiled: dist/src/index.js → two levels up = packages/db/
// When run via tsx: src/index.ts   → one level up  = packages/db/
// Either way the db file lands in packages/db/dev.db, not the caller's CWD.
const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultDbUrl = `file:${resolve(__dirname, '../../dev.db')}`;

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? defaultDbUrl,
});

export const db: PrismaClient = (globalThis.__prismaClient ??= new PrismaClient({ adapter }));

export * from '../generated/client/client.js';
export default db;
