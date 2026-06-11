# NearConnect Web

A hyperlocal community platform that connects people in their neighborhood — featuring real-time chat, activity hubs, event management, tournaments, trips, SOS/help, and more.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vite)
- **Backend:** Node.js with Express & SQLite

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)

### Frontend Setup
```bash
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
node server.js
```

## Project Structure

```
nearconnect-web/
├── index.html                  # Landing page
├── login.html                  # Login page
├── nearconnect-home-feed.html  # Home feed
├── nearconnect-chat-interface.html
├── nearconnect-activity-hub.html
├── nearconnect-map-discovery.html
├── nearconnect-notice-board.html
├── nearconnect-community-help-sos.html
├── nearconnect-games-hub-tournament-brackets.html
├── nearconnect-trips-picnics.html
├── nearconnect-user-profile.html
├── nearconnect-settings-privacy.html
├── nearconnect-onboarding-flow.html
├── event-registration-*.html   # Event registration flow
├── host-tournament-*.html      # Tournament hosting flow
├── public/                     # Static assets (favicon, icons)
├── src/                        # JS modules & styles
│   ├── main.js
│   ├── auth.js
│   ├── sidebar.js
│   ├── style.css
│   └── assets/
├── backend/                    # Express API server
│   ├── server.js
│   ├── db.js
│   └── package.json
├── vite.config.js
└── package.json
```

## License

MIT
