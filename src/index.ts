/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import { DiscordAnalytics } from "@nhcarrigan/discord-analytics";
import { PrismaClient } from "@prisma/client";
import { Client, Events } from "discord.js";
import { scheduleJob } from "node-schedule";
import { completeTask } from "./modules/completeTask.js";
import { createReminder } from "./modules/createReminder.js";
import { sendReminders } from "./modules/sendReminders.js";
import { instantiateServer } from "./server/serve.js";
import { logger } from "./utils/logger.js";

const bot = new Client({
  intents: [],
});
const database = new PrismaClient();

const analytics = new DiscordAnalytics(bot, logger);

bot.once(Events.ClientReady, () => {
  void logger.log("debug", "Client is ready!");
  analytics.startCron();
  const hourly = "0 * * * *";
  scheduleJob("reminders", hourly, () => {
    void sendReminders(bot, database);
  });
});

bot.on(Events.InteractionCreate, (interaction) => {
  if (interaction.isButton()) {
    void completeTask(bot, interaction, database);
  }
  if (interaction.isChatInputCommand()) {
    void createReminder(bot, interaction, database);
  }
});

await bot.login(process.env.BOT_TOKEN ?? "");
instantiateServer();
