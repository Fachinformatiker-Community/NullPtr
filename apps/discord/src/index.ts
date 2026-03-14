import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-subcommands/register';
import {
  ApplicationCommandRegistries,
  LogLevel,
  RegisterBehavior,
  SapphireClient,
  container,
} from '@sapphire/framework';
import { GatewayIntentBits, Partials } from 'discord.js';
import 'dotenv/config';
import { handleStartupError } from './helpers/handleStartupError.js';

// ---------------------------------------------------------------------------
// Application command registration behaviour
//
// BulkOverwrite (Sapphire-recommended default):
//   Replaces ALL registered commands in one atomic API call on every startup.
//   Commands not registered via Sapphire are automatically removed.
//
//   Global (commands/global/) → registered globally
//   Dev guild (commands/dev/) → registered to DEV_GUILD_ID
// ---------------------------------------------------------------------------
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------
const client = new SapphireClient({
  // __dirname = .../apps/discord/src – tells Sapphire where to scan for pieces
  baseUserDirectory: __dirname,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction],
  loadMessageCommandListeners: true,
  defaultPrefix: process.env.BOT_PREFIX ?? '!',
  logger: {
    level: process.env.NODE_ENV === 'production' ? LogLevel.Info : LogLevel.Debug,
  },
});

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------
const shutdown = async (signal: NodeJS.Signals): Promise<never> => {
  container.logger.info(`[Process] Received ${signal} – shutting down gracefully.`);
  await client.destroy();
  process.exit(0);
};

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

// ---------------------------------------------------------------------------
// Safety nets
// ---------------------------------------------------------------------------
process.on('unhandledRejection', (reason) => {
  container.logger.fatal('[Process] Unhandled rejection:', reason);
});

process.on('uncaughtException', (error) => {
  container.logger.fatal('[Process] Uncaught exception:', error);
  void shutdown('SIGTERM');
});

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
const main = async (): Promise<void> => {
  client.logger.info('[Bot] Starting NullPtr...');
  await client.login(process.env.DISCORD_TOKEN).catch(handleStartupError);
};

void main();
