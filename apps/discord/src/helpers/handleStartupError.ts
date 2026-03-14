import { container } from '@sapphire/framework';
import { DiscordjsErrorCodes } from 'discord.js';

// Gateway close codes owned by @discordjs/ws (no longer in DiscordjsErrorCodes)
const WS_DISALLOWED_INTENTS = 4014;
const WS_INVALID_INTENTS = 4013;

/**
 * Classifies a startup login error and logs an actionable message before
 * exiting the process. Call this as the `.catch()` handler on `client.login()`.
 */
export function handleStartupError(error: unknown): never {
  if (!(error instanceof Error)) {
    container.logger.fatal('[Bot] Unknown error during startup:', error);
    process.exit(1);
  }

  const code = (error as { code?: string }).code;

  // @discordjs/ws surfaces intent errors via WebSocket close codes in the message
  const wsCode = parseWsCloseCode(error.message);

  if (wsCode === WS_DISALLOWED_INTENTS || wsCode === WS_INVALID_INTENTS) {
    container.logger.fatal(
      '[Bot] One or more Gateway Intents are not enabled for this application.\n' +
        '      → Open https://discord.com/developers/applications → Your App → Bot.\n' +
        '      → Enable "Server Members Intent" and "Message Content Intent"\n' +
        '        under "Privileged Gateway Intents".',
    );
    process.exit(1);
  }

  switch (code) {
    case DiscordjsErrorCodes.TokenInvalid:
    case DiscordjsErrorCodes.TokenMissing:
      container.logger.fatal(
        '[Bot] Invalid or missing Discord token.\n' +
          '      → Check that DISCORD_TOKEN is set in your .env file.\n' +
          '      → Get your token from: https://discord.com/developers/applications',
      );
      break;

    case DiscordjsErrorCodes.ClientMissingIntents:
      container.logger.fatal(
        '[Bot] SapphireClient was constructed without required intents.\n' +
          '      → Add the missing GatewayIntentBits to the intents array in src/index.ts.',
      );
      break;

    default:
      if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        container.logger.fatal(
          '[Bot] Could not reach the Discord API – check your internet connection.',
        );
      } else {
        container.logger.fatal('[Bot] Failed to start:', error);
      }
  }

  process.exit(1);
}

function parseWsCloseCode(message: string): number | null {
  const match = /(?:close code|code)[:\s]+(\d{4})/i.exec(message);
  return match ? Number(match[1]) : null;
}
