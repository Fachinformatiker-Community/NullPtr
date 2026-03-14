import { Command } from '@sapphire/framework';

/**
 * Base class for globally registered slash commands.
 *
 * Subclasses implement `registerApplicationCommands` and call
 * `registry.registerChatInputCommand(builder)` without passing `guildIds`,
 * which makes Discord register them globally (up to 1 hour propagation delay).
 *
 * @example
 * ```ts
 * export class PingCommand extends GlobalCommand {
 *   public override registerApplicationCommands(registry: Command.Registry) {
 *     registry.registerChatInputCommand((builder) =>
 *       builder.setName('ping').setDescription('Replies with Pong!'),
 *     );
 *   }
 * }
 * ```
 */
export abstract class GlobalCommand extends Command {}
