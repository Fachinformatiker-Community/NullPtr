import { ApplicationCommandRegistry, Command } from '@sapphire/framework';

/**
 * Base class for development-only slash commands.
 *
 * Commands are registered exclusively to the guild specified by `DEV_GUILD_ID`
 * in the environment. If `DEV_GUILD_ID` is not set the command is skipped
 * with a warning — this makes it safe to omit in production.
 *
 * Subclasses implement `registerDevApplicationCommands` instead of
 * `registerApplicationCommands`. The `guildId` is guaranteed to be present.
 *
 * @example
 * ```ts
 * export class TestCommand extends DevCommand {
 *   protected override registerDevApplicationCommands(
 *     registry: Command.Registry,
 *     guildId: string,
 *   ) {
 *     registry.registerChatInputCommand(
 *       (builder) => builder.setName('test').setDescription('Dev-only test'),
 *       { guildIds: [guildId] },
 *     );
 *   }
 * }
 * ```
 */
export abstract class DevCommand extends Command {
  public override registerApplicationCommands(registry: ApplicationCommandRegistry): void {
    const guildId = process.env.DEV_GUILD_ID;

    if (!guildId) {
      this.container.logger.warn(
        `[DevCommand] DEV_GUILD_ID is not set – skipping registration of "${this.name}".`,
      );
      return;
    }

    this.registerDevApplicationCommands(registry, guildId);
  }

  /**
   * Register this command's application command(s) for the dev guild.
   * Always pass `{ guildIds: [guildId] }` to `registry.registerChatInputCommand`.
   */
  protected abstract registerDevApplicationCommands(
    registry: ApplicationCommandRegistry,
    guildId: string,
  ): void;
}
