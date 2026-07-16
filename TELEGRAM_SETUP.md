# Telegram Contact Form Setup

The contact form posts to `contact.php`, which sends the message to Telegram from the server. Do not put your bot token in frontend JavaScript.

Set these environment variables on your PHP server:

```text
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

For local development, copy `.env.example` to `.env` and put your real values there. `.env` is ignored so it does not get committed.

Then open `contact.html` through a PHP-capable server. Opening it directly from the filesystem will show the form, but `contact.php` needs a web server with PHP enabled to send the Telegram message.
