import { Command } from '@sapphire/framework';
import { GlobalCommand } from '../../lib/GlobalCommand.js';

export class PingCommand extends GlobalCommand {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('ping')
        .setDescription('Check the bot latency'),
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const { resource } = await interaction.reply({ content: 'Pinging…', withResponse: true });

    const roundtrip = resource!.message!.createdTimestamp - interaction.createdTimestamp;
    const ws = interaction.client.ws.ping;

    return interaction.editReply(
      `🏓 Pong!\n> Roundtrip: \`${roundtrip}ms\`\n> Websocket: \`${ws}ms\``,
    );
  }
}
