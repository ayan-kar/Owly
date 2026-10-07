# ZoomClone — Full Stack Video Conferencing Web Application

A full stack, real-time video conferencing web application that lets users register, sign in, host and join virtual meetings with multi-participant video, in-call chat, and a personal meeting history.

Built as a self-directed project to practice end-to-end full stack development — from REST API design and WebSocket signaling to responsive UI.

## ✨ Features

- **User Authentication** — secure sign up / sign in with bcrypt password hashing and token-based sessions
- **Create & Join Meetings** — instant meeting rooms accessible via unique meeting links
- **Real-Time Video & Audio** — multi-participant WebRTC peer-to-peer streaming coordinated with Socket.io signaling
- **In-Call Chat** — per-room real-time messaging with message history restored on join
- **Screen & Media Controls** — toggle video / microphone, switch cameras, and present your screen
- **Meeting History** — personal dashboard of past calls with one-click rejoin
- **Protected Routes** — authenticated-only pages guarded with a custom React auth context + HOC
- **Responsive UI** — clean, modern interface built with Material-UI

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React.js, JavaScript (ES6+), Material-UI (MUI), React Router, Axios |
| **Backend** | Node.js, Express.js, Socket.io, bcrypt, CORS |
| **Database** | MongoDB with Mongoose ODM |
| **Real-Time** | WebRTC, Socket.io (signaling, room management, chat) |
| **Tooling** | npm, nodemon, React Scripts, Git |

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+) and npm
- MongoDB database — a local instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/ZoomClone.git
cd ZoomClone
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Connect your database — in `backend/src/app.js`, replace the `mongoose.connect(...)` call with your own MongoDB connection string (recommended: read it from an environment variable instead of hardcoding):

```js
await mongoose.connect(process.env.MONGO_URI);
```

Start the backend (runs on `http://localhost:8000`):

```bash
npm run dev
```

### 3. Configure & run the frontend

In a new terminal:

```bash
cd frontend
npm install
```

In `frontend/src/environment.js`, set `IS_PROD = false` so the frontend talks to your local backend:

```js
let IS_PROD = false;
```

Then start the app (runs on `http://localhost:3000`):

```bash
npm start
```

### 4. Use the app

1. Open `http://localhost:3000` and register a new account
2. Create a meeting from the home page and share the link, or join with a meeting code
3. Enjoy your call 🎥

## 📁 Project Structure

```
Zoom-main/
├── backend/
│   └── src/
│       ├── app.js                        # Express + HTTP server + Socket.io setup
│       ├── controllers/
│       │   ├── socketManager.js          # WebRTC signaling, rooms, chat
│       │   └── user.controller.js        # Auth + meeting history logic
│       ├── models/
│       │   ├── user.model.js             # User schema
│       │   └── meeting.model.js          # Meeting history schema
│       └── routes/
│           └── users.routes.js           # /api/v1/users/* REST endpoints
└── frontend/
    └── src/
        ├── App.js                        # Routes
        ├── contexts/AuthContext.jsx      # Global auth state
        ├── pages/
        │   ├── landing.jsx               # Landing page
        │   ├── authentication.jsx        # Sign in / Sign up
        │   ├── home.jsx                  # Home / create-join meeting
        │   ├── VideoMeet.jsx             # The actual video meeting room
        │   └── history.jsx               # Meeting history dashboard
        ├── utils/withAuth.jsx            # Route guard HOC
        └── environment.js                # Backend URL config
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/users/register` | Register a new user |
| `POST` | `/api/v1/users/login` | Log in and receive an auth token |
| `POST` | `/api/v1/users/add_to_activity` | Log a meeting to user history |
| `GET`  | `/api/v1/users/get_all_activity` | Fetch the user's meeting history |

## ⚙️ How It Works

1. **Auth** — the frontend sends credentials to the Express API; passwords are hashed with bcrypt, and a token is issued and stored client-side.
2. **Signaling** — when a user joins a meeting room, Socket.io registers the socket in a room map and notifies existing participants.
3. **WebRTC** — peers exchange SDP offers/answers and ICE candidates over the `signal` Socket.io event to establish direct video/audio streams.
4. **Chat** — chat messages are routed to every socket in the same room and buffered so a late joiner sees the conversation.
5. **History** — each meeting is persisted to MongoDB and surfaced on the `/history` page.

## 🌱 Ideas for Future Improvements

- [ ] Deploy frontend (Vercel/Netlify) + backend (Render) with CI/CD

## 👤 Author

**Ayan** — built from scratch as a full stack learning project.

Feel free to fork, star ⭐, and open issues or PRs!

## 📄 License

ISC
