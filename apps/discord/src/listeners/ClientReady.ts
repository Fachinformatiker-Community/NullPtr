import { Events, Listener } from '@sapphire/framework';
import type { Client } from 'discord.js';
import { startPresence } from '../helpers/presence.js';

export class ClientReadyListener extends Listener<typeof Events.ClientReady> {
  public constructor(context: Listener.LoaderContext) {
    super(context, { event: Events.ClientReady, once: true });
  }

  public async run(client: Client<true>): Promise<void> {
    this.container.logger.info(
      `[Bot] Logged in as ${client.user.tag} – serving ${client.guilds.cache.size} guild(s).`,
    );

    // Populate the member cache for accurate presence counts.
    // Requires GuildMembers privileged intent.
    await Promise.all(client.guilds.cache.map((guild) => guild.members.fetch()));

    startPresence(client);
  }
}
