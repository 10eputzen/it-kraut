import { setGlobalOptions } from "firebase-functions/v2";
import admin = require("firebase-admin");

if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}

setGlobalOptions({ region: "europe-west3" });

const discordBotFunction = require("./discordBot");
exports.discordBot = discordBotFunction.discordBot;
