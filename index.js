require("dotenv").config();
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input"); // npm install input

const fetchMessages = require("./functions/fetchMessages");
const parseArticles = require("./functions/parseArticles");

// Load API credentials from .env file
const apiId = parseInt(process.env.TELEGRAM_API_ID); // Your api_id
const apiHash = process.env.TELEGRAM_API_HASH; // Your api_hash
const stringSession = new StringSession(""); // Using in-memory session

// Channel username (e.g., @nytimes)
const channelUsername = "@nytimes";

// Output file names
const fileName = "out/output.json";
const parseFileName = "out/parsed_articles.json";

(async () => {
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  console.log("You're connected!");

  // Fetch messages from the channel
  await fetchMessages(client, channelUsername, fileName);

  await parseArticles(fileName, parseFileName);

  await client.disconnect();
})();
