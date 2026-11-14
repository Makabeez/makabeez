# Makabeez · break-test reviews

Service site for adversarial reviews of points programs, trading contests, airdrops and agent payment rails.

- `index.html` — landing page
- `sample-report.html` — sample Teardown report (Flop Labs close-1)
- `styles.css` — shared styles
- `api/og.js` — social preview image, generated on Vercel (`/api/og`)
- `api/quote.js` — quote form endpoint: forwards each request to Telegram, stores nothing. Needs `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in the Vercel project's environment variables

Static HTML, no build step. Deploys on Vercel on every push to `main`.

Contact: Telegram [@makabeez](https://t.me/makabeez) · X [@GeiserJoe2](https://x.com/GeiserJoe2)
