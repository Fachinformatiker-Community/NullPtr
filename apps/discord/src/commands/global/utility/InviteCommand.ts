import { Command } from '@sapphire/framework';
import { MessageFlags, OAuth2Scopes, PermissionFlagsBits } from 'discord.js';
import { GlobalCommand } from '../../lib/GlobalCommand.js';

export class InviteCommand extends GlobalCommand {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('invite')
        .setDescription('Get the invite link to add the bot to your server'),
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const url = interaction.client.generateInvite({
      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
      permissions: [
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.UseExternalEmojis,
        PermissionFlagsBits.AddReactions,
      ],
    });

    return interaction.reply({
      content: `📨 **Invite NullPtr to your server:**\n${url}`,
      flags: MessageFlags.Ephemeral,
    });
  }
}
