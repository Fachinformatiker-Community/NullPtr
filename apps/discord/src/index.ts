import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-subcommands/register';
import { SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits, Partials } from 'discord.js';
import 'dotenv/config';

const client = new SapphireClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
  loadMessageCommandListeners: true,
});

const main = async (): Promise<void> => {
  try {
    client.logger.info('Logging in...');
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    client.logger.fatal(error);
    await client.destroy();
    process.exit(1);
  }
};

void main();
