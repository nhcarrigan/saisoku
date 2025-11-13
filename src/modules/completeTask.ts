/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ButtonInteraction,
  type Client,
} from "discord.js";
import {
  bullyingCompletion,
  encouragingCompletion,
} from "../config/phrases.js";
import { getRandomValue } from "../utils/getRandomValue.js";
import { isEntitled } from "./isEntitled.js";
import type { PrismaClient } from "@prisma/client";

/**
 * Completes a task.
 * @param bot - The Discord client.
 * @param interaction - The interaction payload from Discord.
 * @param database - The database client.
 */
export const completeTask = async(
  bot: Client,
  interaction: ButtonInteraction,
  database: PrismaClient,
): Promise<void> => {
  await interaction.deferReply();
  const entitled = await isEntitled(bot, interaction.user.id);
  if (!entitled) {
    await interaction.editReply({
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().
            setStyle(ButtonStyle.Premium).
            setSKUId("1438369555956105382"),
        ),
      ],
      content: `You must have a subscription to use this bot. Please note that if your subscription lapses, you will stop receiving reminders until you restore it.`,
    });
    return;
  }
  const task = await database.reminders.findUnique({
    where: {
      id: interaction.customId,
    },
  });
  if (!task) {
    await interaction.editReply({ content: "Task not found" });
    return;
  }
  await database.reminders.delete({
    where: {
      id: task.id,
    },
  });
  const phrase = getRandomValue(
    task.isHarsh
      ? bullyingCompletion
      : encouragingCompletion,
  );
  await interaction.editReply({ content: phrase });
};
