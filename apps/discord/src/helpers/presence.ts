import { container } from '@sapphire/framework';
import { ActivityType, type Client } from 'discord.js';

const UPDATE_INTERVAL_MS = 10 * 60 * 1_000; // 10 minutes

function getMemberCount(client: Client<true>): number {
  return client.guilds.cache.reduce((total, guild) => {
    const humans = guild.members.cache.filter((m) => !m.user.bot).size;
    return total + humans;
  }, 0);
}

function updatePresence(client: Client<true>): void {
  const count = getMemberCount(client);

  client.user.setPresence({
    activities: [
      {
        name: `over ${count.toLocaleString()} Members`,
        type: ActivityType.Watching,
      },
    ],
  });

  container.logger.debug(`[Presence] Updated → Watching over ${count.toLocaleString()} Members`);
}

/**
 * Sets the bot's rich presence once immediately, then refreshes every 10 minutes.
 * Call this inside the `ClientReady` listener after the guild cache is populated.
 *
 * @returns A `NodeJS.Timeout` handle – clear it on shutdown if needed.
 */
export function startPresence(client: Client<true>): NodeJS.Timeout {
  updatePresence(client);
  return setInterval(() => updatePresence(client), UPDATE_INTERVAL_MS);
}
