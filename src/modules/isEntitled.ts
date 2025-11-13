/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import { entitledUserIds } from "../config/entitlements.js";
import type { Client } from "discord.js";

/**
 * Checks if a user is entitled to use the bot.
 * @param bot - The Discord client.
 * @param userId - The ID of the user to check.
 * @returns True if the user is entitled, false otherwise.
 */
export const isEntitled = async(
  bot: Client,
  userId: string,
): Promise<boolean> => {
  if (entitledUserIds.includes(userId)) {
    return true;
  }
  const hasEntitlement = await bot.application?.entitlements.
    fetch({ excludeDeleted: true, excludeEnded: true, user: userId }).
    catch(() => {
      return null;
    });
  return (
    hasEntitlement !== null
    && hasEntitlement?.size !== undefined
    && hasEntitlement.size > 0
  );
};
