# Steelcut AI assistant

The existing website design was left intact. The AI assistant was added as an isolated fixed chat button/panel.

- Frontend: `index.html`, `css/style.css`, `js/main.js`
- Backend: `backend/`
- The frontend first tries `POST /api/chat`.
- If the backend is not running, the widget falls back to a small local FAQ response so the demo still works.
- For production, serve the frontend and backend under the same origin or configure the API URL/CORS appropriately.
