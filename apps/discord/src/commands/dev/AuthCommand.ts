import { Command } from '@sapphire/framework';
import { db } from '@nullptr/db';
import { MessageFlags } from 'discord.js';
import { DevCommand } from '../../lib/DevCommand.js';

export class AuthCommand extends DevCommand {
  protected override registerDevApplicationCommands(
    registry: Command.Registry,
    guildId: string,
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName('auth')
          .setDescription('[DEV] Register a Discord user as a Developer in the database')
          .addUserOption((option) =>
            option
              .setName('user')
              .setDescription('The Discord user to register')
              .setRequired(true),
          ),
      { guildIds: [guildId] },
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    // One-time bootstrap guard — refuse if any user already exists
    const existingCount = await db.user.count();
    if (existingCount > 0) {
      return interaction.editReply('🔒 **Superuser already exists.** This command can only be used once.');
    }

    const target = interaction.options.getUser('user', true);

    // Resolve the Discord platform row (seeded on deploy)
    const platform = await db.platform.findUnique({ where: { name: 'discord' } });
    if (!platform) {
      return interaction.editReply('❌ Platform "discord" not found. Run `db:seed` first.');
    }

    // Resolve the Developer role row (seeded on deploy)
    const role = await db.role.findUnique({ where: { name: 'Developer' } });
    if (!role) {
      return interaction.editReply('❌ Role "Developer" not found. Run `db:seed` first.');
    }

    // Find an existing UserPlatformAccount for this Discord user, or create one
    let account = await db.userPlatformAccount.findUnique({
      where: {
        platformId_platformAccountId: {
          platformId: platform.id,
          platformAccountId: target.id,
        },
      },
      include: { user: true },
    });

    if (!account) {
      // New internal user + Discord account
      const user = await db.user.create({
        data: {
          accounts: {
            create: {
              platformId: platform.id,
              platformAccountId: target.id,
              username: target.username,
            },
          },
        },
      });

      account = await db.userPlatformAccount.findUniqueOrThrow({
        where: {
          platformId_platformAccountId: {
            platformId: platform.id,
            platformAccountId: target.id,
          },
        },
        include: { user: true },
      });

      this.container.logger.info(
        `[Auth] Created new internal user #${user.id} for Discord user ${target.tag} (${target.id})`,
      );
    }

    // Upsert Developer role assignment
    await db.userRole.upsert({
      where: {
        userId_roleId: {
          userId: account.userId,
          roleId: role.id,
        },
      },
      update: {},
      create: {
        userId: account.userId,
        roleId: role.id,
        grantedBy: null,
      },
    });

    return interaction.editReply(
      `✅ <@${target.id}> is now registered as a **Developer** (internal user #${account.userId}).`,
    );
  }
}
