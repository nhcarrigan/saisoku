/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import fastify from "fastify";
import { logger } from "../utils/logger.js";

const html = `<!DOCTYPE html>
<html>
  <head>
    <title>Saisoku</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="A Discord bot that encourages (or bullies) you to be more productive." />
    <script src="https://cdn.nhcarrigan.com/headers/index.js" async defer></script>
  </head>
  <body>
    <main>
    <h1>Saisoku</h1>
    <img src="https://cdn.nhcarrigan.com/new-avatars/saisoku-full.png" width="250" alt="Saisoku" />
    <section>
      <p>A Discord bot that encourages (or bullies) you to be more productive.</p>
        <a href="https://discord.com/oauth2/authorize?client_id=1438325099345346723" class="social-button discord-button" style="display: inline-block; background-color: #5865F2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 5px;">
        <i class="fab fa-discord"></i> Add to Discord
      </a>
    </section>
    <section>
        <h2>Links</h2>
        <p>
            <a href="https://git.nhcarrigan.com/nhcarrigan/saisoku">
                <i class="fa-solid fa-code"></i> Source Code
            </a>
        </p>
        <p>
            <a href="https://docs.nhcarrigan.com/">
                <i class="fa-solid fa-book"></i> Documentation
            </a>
        </p>
        <p>
            <a href="https://chat.nhcarrigan.com">
                <i class="fa-solid fa-circle-info"></i> Support
            </a>
        </p>
    </section>
    </main>
  </body>
</html>`;

/**
 * Starts up a web server for health monitoring.
 */
export const instantiateServer = (): void => {
  try {
    const server = fastify({
      logger: false,
    });

    server.get("/", (_request, response) => {
      response.header("Content-Type", "text/html");
      response.send(html);
    });

    server.listen({ port: 9100 }, (error) => {
      if (error) {
        void logger.error("instantiate server", error);
        return;
      }
      void logger.log("debug", "Server listening on port 9100.");
    });
  } catch (error) {
    if (error instanceof Error) {
      void logger.error("instantiate server", error);
      return;
    }
    void logger.error("instantiate server", new Error(String(error)));
  }
};
