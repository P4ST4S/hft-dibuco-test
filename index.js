require("dotenv").config();
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { Api } = require("telegram/tl");
const input = require("input"); // npm install input
const fs = require("fs");

// Load API credentials from .env file
const apiId = parseInt(process.env.TELEGRAM_API_ID); // Your api_id
const apiHash = process.env.TELEGRAM_API_HASH; // Your api_hash
const stringSession = new StringSession(""); // Using in-memory session

// Channel username (e.g., @nytimes)
const channelUsername = "@nytimes";
const fileName = "output.json";

async function fetchMessages(client, channelUsername) {
  try {
    // Get the channel entity
    const channel = await client.getEntity(channelUsername);

    // Fetch the channel's message history
    const history = await client.invoke(
      new Api.messages.GetHistory({
        peer: channel,
        limit: 10, // Number of messages to fetch
        offsetDate: null,
        offsetId: 0,
        maxId: 0,
        minId: 0,
        addOffset: 0,
        hash: 0,
      })
    );

    const messages = [];

    // Process each message
    for (const message of history.messages) {
      if (message.message) {
        let mediaInfo = null;
        let urls = [];

        // Handle media types if any
        if (message.media) {
          if (message.media instanceof Api.MessageMediaPhoto) {
            mediaInfo = {
              type: "photo",
              url: message.media.photo.id, // Adjust based on your needs
            };
          } else if (message.media instanceof Api.MessageMediaDocument) {
            // Handle document types such as video
            if (message.media.document.mimeType.startsWith("video/")) {
              mediaInfo = {
                type: "video",
                url: message.media.document.id, // Modify based on your needs
              };
            }
          }
        }

        // Extract URLs from entities if available
        if (message.entities) {
          for (const entity of message.entities) {
            if (entity instanceof Api.MessageEntityTextUrl) {
              urls.push(entity.url); // Add each URL found to the urls array
            }
          }
        }

        // Append message details
        messages.push({
          id: message.id,
          date: message.date,
          message: message.message,
          media: mediaInfo,
          sender_id: message.fromId ? message.fromId.userId : null,
          urls: urls, // Store all URLs found in this message
        });
      }
    }

    // Log or process the messages (you could save to JSON or database here)
    fs.writeFileSync(fileName, JSON.stringify(messages, null, 2));
    console.log("Messages fetched and saved to output.json file.");
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
}

async function parsedArticles(file) {
  const rawData = fs.readFileSync(file);
  const messages = JSON.parse(rawData);

  const parsedArticles = [];

  messages.forEach((msg) => {
    const lines = msg.message.split("\n").filter((line) => line.trim() !== "");
    let articleIndex = 0;

    // Loop through lines to parse titles and bodies
    for (let i = 1; i < lines.length; i += 2) {
      const title = lines[i];
      const body = lines[i + 1] || ""; // Sometimes the body might not be available

      const article = {
        id: msg.id,
        date: msg.date,
        title: title,
        body: body,
        url: msg.urls[articleIndex] || null, // Match URL based on article index
        media: msg.media,
      };

      parsedArticles.push(article);
      articleIndex++;
    }
  });

  fs.writeFileSync(
    "parsed_articles.json",
    JSON.stringify(parsedArticles, null, 2)
  );
  console.log("Articles parsed and saved to parsed_articles.json");
}

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
  await fetchMessages(client, channelUsername);

  await client.disconnect();

  parsedArticles(fileName);
})();
