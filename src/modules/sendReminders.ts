/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type Client,
} from "discord.js";
import { bullyingPhrases, encouragingPhrases } from "../config/phrases.js";
import { getRandomValue } from "../utils/getRandomValue.js";
import { isEntitled } from "./isEntitled.js";
import type { PrismaClient } from "@prisma/client";

/**
 * Fetches all active reminders, sends them to the users.
 * @param bot - The Discord client.
 * @param database - The database client.
 */
export const sendReminders = async(
  bot: Client,
  database: PrismaClient,
): Promise<void> => {
  const reminders = await database.reminders.findMany();
  await Promise.all(
    reminders.map(async(reminder) => {
      const user
        = bot.users.cache.get(reminder.userId)
        ?? await bot.users.fetch(reminder.userId).catch(() => {
          return null;
        });
      if (user === null) {
        await database.reminders.delete({
          where: {
            id: reminder.id,
          },
        });
        return;
      }
      const entitled = await isEntitled(bot, user.id);
      if (!entitled) {
        return;
      }
      const phrase = getRandomValue(
        reminder.isHarsh
          ? bullyingPhrases
          : encouragingPhrases,
      );
      await user.send({
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().
              setCustomId(reminder.id).
              setLabel("Complete").
              setStyle(ButtonStyle.Success),
            new ButtonBuilder().
              setStyle(ButtonStyle.Link).
              setURL("https://chat.nhcarrigan.com").
              setLabel("Need help?"),
          ),
        ],
        content: phrase.replace("{{ task name }}", `**${reminder.reminder}**`),
      });
    }),
  );
};
