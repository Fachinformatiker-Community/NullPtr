import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/client/client.js';
const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? 'file:./dev.db',
});
export const db = (globalThis.__prismaClient ??= new PrismaClient({ adapter }));
export * from '../generated/client/client.js';
export default db;
//# sourceMappingURL=index.js.map