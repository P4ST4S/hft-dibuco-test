const { Api } = require("telegram/tl");
const fs = require("fs");

async function fetchMessages(client, channelUsername, fileName) {
  try {
    // Get the channel entity
    const channel = await client.getEntity(channelUsername);

    // Fetch the channel's message history
    const history = await client.invoke(
      new Api.messages.GetHistory({
        peer: channel,
        limit: 10, // Number of messages to fetch
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

module.exports = fetchMessages;
