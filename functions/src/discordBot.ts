import { defineSecret } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const DISCORD_MESSAGE_TOKEN = defineSecret("DISCORD_MESSAGE_TOKEN");

exports.discordBot = onRequest(
    {
        cors: [/firebase\.com$/, "montage-portal.com", "localhost"],
        secrets: [DISCORD_MESSAGE_TOKEN]
    },
    async (req, res) => {
        try {
            if (!req.body) {
                throw new Error('Request body is required');
            }

            const DISCORD_TOKEN = DISCORD_MESSAGE_TOKEN.value();
            console.log('Discord token:', DISCORD_TOKEN); // Log the token to verify

            if (!DISCORD_TOKEN) {
                throw new Error('Discord token is required');
            }

            const { channelId, message } = req.body;
            if (!message) {
                throw new Error('Message is required');
            }
            if (!channelId) {
                throw new Error('Channel ID is required');
            }
            await client.login(DISCORD_TOKEN);

            const channel = client.channels.cache.get(channelId) || await client.channels.fetch(channelId);
            if (!channel) {
                throw new Error('Channel not found');
            }
            const result = await channel.send(message);

            res.status(200).send({ success: 'true', message: result });
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }
);


