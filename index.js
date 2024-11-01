require("dotenv").config();
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input"); // npm install input

const fetchMessages = require("./functions/fetchMessages");
const parseArticles = require("./functions/parseArticles");

// Load API credentials from .env file
const apiId = parseInt(process.env.TELEGRAM_API_ID); // Your api_id
const apiHash = process.env.TELEGRAM_API_HASH; // Your api_hash

// Create a new StringSession or use an existing one
// const stringSession = new StringSession(""); // Using in-memory session

// Connect to a session
const sessionString = require("fs").readFileSync("session.txt", "utf8");
const stringSession = new StringSession(sessionString);

// Channel username (e.g., @nytimes)
const channelUsername = "@nytimes";

// Output file names
const fileName = "out/output.json";
const parseFileName = "out/parsed_articles.json";

(async () => {
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  try {
    // await client.start({
    //   phoneNumber: async () => await input.text("Please enter your number: "),
    //   password: async () => await input.text("Please enter your password: "),
    //   phoneCode: async () =>
    //     await input.text("Please enter the code you received: "),
    //   onError: (err) => console.log(err),
    // });

    // console.log("You are now connected!");
    // console.log("Your session string:", client.session.save()); // Save this string

    // // Optional: Save the string to a file for future use
    // require("fs").writeFileSync("session.txt", client.session.save());

    // If session is already connected, load the session
    await client.connect();

    // Fetch messages
    await fetchMessages(client, channelUsername, fileName);
    await parseArticles(fileName, parseFileName);
  } catch (error) {
    if (error.message.includes("TIMEOUT")) {
      console.log("Connection timed out. Retrying...");
      // Retry logic here
    } else {
      console.error("An error occurred:", error);
    }
  } finally {
    await client.disconnect();
  }
})();
