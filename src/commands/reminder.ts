/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import {
  ApplicationIntegrationType,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";

const reminder = new SlashCommandBuilder().
  setName("reminder").
  setIntegrationTypes(ApplicationIntegrationType.UserInstall).
  setContexts(
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ).
  setDescription("Ask the bot to remind you hourly to complete a task.").
  addStringOption((option) => {
    return option.
      setName("task").
      setDescription("The task to remind you about.").
      setMaxLength(50).
      setRequired(true);
  }).
  addBooleanOption((option) => {
    return option.
      setName("bully").
      setDescription(
        "Whether the bot should bully you instead of encouraging you.",
      ).
      setRequired(true);
  });

// eslint-disable-next-line no-console -- We only use this to generate the JSON payload for the API.
console.log(JSON.stringify(reminder.toJSON(), null, 2));
