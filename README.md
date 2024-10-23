## Telegram Channel Message Scraper

This project is a Node.js script that fetches messages from a public Telegram channel (such as @nytimes) using the Telegram API. It uses the `telegram` library and stores the fetched messages in a JSON file (`output.json`).

### Prerequisites

Before running the script, you need to have:

1. Node.js installed on your machine. You can download it from here.
2. Telegram API ID and Hash. You can get these by creating a Telegram application at my.telegram.org.

### Getting Started

#### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/P4ST4S/hft-dibuco-test.git
cd telegram-channel-scraper
```

#### 2. Install Dependencies

Install the required dependencies using `npm`:

```bash
npm install
```

#### 3. Create a `.env` File

Create a `.env` file in the root directory of the project and add the following environment variables, following the [`.env.sample`](.env.sample) file:

```env
TELEGRAM_API_ID=your_api_id
TELEGRAM_API_HASH=your_api_hash
```

- Replace `your_api_id` with your Telegram API ID.
- Replace `your_api_hash` with your Telegram API hash.

You can get these from [my.telegram.org](https://my.telegram.org)

#### 4. Run the Script

To run the script, use the following command:

```bash
npm run prod
```

When you run the script, it will prompt you for the following information:

- **Your phone number**: Enter your Telegram phone number (including country code).
- **Telegram code**: A login code will be sent to you via Telegram. Enter the code when prompted.
- **Your 2FA password** (if applicable): If you have set up 2FA on your Telegram account, enter the password.
- **Channel name**: Enter the Telegram channel username (without the `@`). For example, if you're scraping `@nytimes`, you will just type `nytimes`.

#### 5. Output

After the script runs successfully, it will fetch the most recent 10 messages from the specified channel and save them to `output.json` in the following format:

```json
[
  {
    "id": 123456,
    "date": "2023-10-01T12:00:00.000Z",
    "message": "This is a sample message",
    "media": {
      "type": "photo",
      "url": "123456789"
    },
    "sender_id": 987654321
  },
  ...
]
```

#### 6. Troubleshooting

- **Session expired**: If you receive an error about an expired session or authentication, simply re-run the script and log in again.
- **Telegram API Errors**: Ensure that you have the correct API ID and Hash from your [Telegram app](https://my.telegram.org).

#### 7. Dependencies

This project uses the following Node.js packages:

- `dotenv`: For loading environment variables.
- `telegram`: For interacting with Telegram API (gramjs).
- `input`: For handling user input in the terminal.
- `fs`: Built-in Node.js module for file system operations (to save the output to a file).

#### 8. Notes

- This script only fetches the most recent 10 messages from a channel. You can adjust the `limit` parameter in the `fetchMessages` function to retrieve more or fewer messages.
- Ensure that you are using this responsibly and in compliance with Telegram's API terms of service.
