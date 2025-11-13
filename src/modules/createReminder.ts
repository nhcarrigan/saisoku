/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
  type Client,
} from "discord.js";
import { isEntitled } from "./isEntitled.js";
import type { PrismaClient } from "@prisma/client";

/**
 * Creates a reminder.
 * @param bot - The Discord client.
 * @param interaction - The interaction payload from Discord.
 * @param database - The database client.
 */
export const createReminder = async(
  bot: Client,
  interaction: ChatInputCommandInteraction,
  database: PrismaClient,
): Promise<void> => {
  await interaction.deferReply({ ephemeral: true });
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
  const existingUserReminders = await database.reminders.findMany({
    where: {
      userId: interaction.user.id,
    },
  });
  if (existingUserReminders.length >= 5) {
    await interaction.editReply({
      content: "You can only have 5 reminders at a time.",
    });
    return;
  }
  const task = interaction.options.getString("task", true);
  const bully = interaction.options.getBoolean("bully", true);
  await database.reminders.create({
    data: {
      isHarsh:  bully,
      reminder: task,
      userId:   interaction.user.id,
    },
  });
  await interaction.editReply({
    content: `I will remind you about **${task}** every hour until you complete it.`,
  });
};
