# Steelcut AI backend

This is the optional real-AI backend for the website chat widget.

## Setup

1. Install Node.js 20+.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Put your server-side AI API key in `.env`.
6. Start with `npm start`.

The website calls `POST /api/chat` with `{ "message": "..." }` and expects `{ "reply": "..." }`.

Keep the API key in the backend `.env` file. Do not put it in `index.html` or `js/main.js`.
