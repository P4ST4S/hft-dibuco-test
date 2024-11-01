const fs = require("fs");

async function parseArticles(fileName, parseFileName) {
  const rawData = fs.readFileSync(fileName);
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

  fs.writeFileSync(parseFileName, JSON.stringify(parsedArticles, null, 2));
  console.log("Articles parsed and saved to parsed_articles.json");
}

module.exports = parseArticles;
