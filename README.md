# 𓉳 ⃝𝗡𝗜𝗖𝗘𝗚𝗢𝗟𝗗₊ ⃝ 𝗠𝗢𝗡𓉳 ⃝ 𓃵

Modular WhatsApp command bot built on Baileys, with optional Telegram-controlled pairing.

## Telegram pairing

1. Create a Telegram bot with BotFather and copy its token.
2. Put the token in `.env`:
   `TELEGRAM_BOT_TOKEN=your_token_here`
3. Start the bot with `npm install && npm start`.
4. Open your Telegram bot and send:
   `/pair 2348012345678`
5. The bot replies with a WhatsApp pairing code.
6. On the WhatsApp phone: Linked Devices → Link a Device → Link with phone number instead, then enter the code.

Use the full WhatsApp number with country code, without `+`, spaces, or dashes.

The supplied NICEGOLD image is stored at `assets/nicegold.jpg` and is used by the `.menu` command as the menu image and as the WhatsApp profile-picture source when supported by the connected account.

## Environment

```env
OWNER_NUMBERS=2348012345678
BOT_PREFIX=.
TELEGRAM_BOT_TOKEN=
```

Do not share the `sessions/` folder or Telegram bot token.

## Run

```bash
npm install
cp .env.example .env
npm start
```

If no Telegram token is configured, the bot can still show a terminal QR for local pairing.
