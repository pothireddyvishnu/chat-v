# Chat V

A full-stack ChatGPT-style chat application built with the **MERN** stack and powered by **Google Gemini**. Users can sign up, log in, create multiple chat threads, switch between dark/light themes, and manage their account.

---

## Features

- Email + password authentication with JWT (stored in httpOnly cookies)
- Multiple chat threads per user (create / view / delete)
- Conversations powered by Google Gemini (`gemini-3-flash-preview`)
- Markdown + syntax-highlighted code rendering in replies
- Dark / light theme preference saved per user
- Profile management — update name, email, password, clear chats, or delete account

---

## Tech Stack

**Frontend**

- React 19 + Vite
- react-markdown + rehype-highlight
- react-spinners

**Backend**

- Node.js + Express 5
- MongoDB + Mongoose
- JWT + bcryptjs (auth)
- Google Gemini API (via OpenAI-compatible endpoint)

---

## Project Structure

```
Chat V/
├── Backend/
│   ├── middlewares/    # JWT auth middleware
│   ├── models/         # Mongoose models (User, Thread)
│   ├── routes/         # API routes (auth, user, chat)
│   ├── utils/          # Gemini API wrapper
│   ├── server.js       # Express entry point
│   └── .env            # (not committed — see .env.example)
└── Frontend/
    ├── public/
    ├── src/            # React components, contexts, styles
    ├── index.html
    └── vite.config.js
```

---

## Prerequisites

- **Node.js** v18 or newer
- **npm** (comes with Node)
- A **MongoDB** database — either:
    - a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (recommended), or
    - a local MongoDB instance running on `mongodb://localhost:27017`
- A **Google Gemini API key** — get one free at [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## Required API Keys & Environment Variables

### Backend — `Backend/.env`

| Variable         | Required | Description                                                                 |
| ---------------- | -------- | --------------------------------------------------------------------------- |
| `GEMINI_API_KEY` | Yes      | Your Google Gemini API key (from AI Studio)                                 |
| `MONGODB_URI`    | Yes      | MongoDB connection string (Atlas URI or local)                              |
| `JWT_SECRET`     | Yes      | Any long random string used to sign JWT tokens                              |
| `PORT`           | No       | Server port (defaults to `8080`, can be changable)                          |
| `CLIENT_ORIGIN`  | No       | Allowed CORS origin (defaults to `http://localhost:5173`, can be changable) |

Example `Backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_url
JWT_SECRET=replace_this_with_a_long_random_string
PORT=8080
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend — `Frontend/.env` (only needed for production builds)

| Variable       | Required  | Description                                                              |
| -------------- | --------- | ------------------------------------------------------------------------ |
| `VITE_API_URL` | Prod only | Full URL of your deployed backend (e.g. `https://your-api.onrender.com`) |

In development the frontend automatically points at `http://localhost:8080`, so no `.env` is needed locally.

---

## Setup & Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/pothireddyvishnu/chat-v
cd "chat-v"
```

### 2. Set up the Backend

```bash
cd Backend
npm install
```

Create a `Backend/.env` file using the template above, then start the server:

```bash
nodemon server.js      # starts with nodemon (auto-reload)
```

The API will run on **http://localhost:8080**.

### 3. Set up the Frontend

In a **new terminal**:

```bash
cd Frontend
npm install
npm run dev
```

The app will open at **http://localhost:5173**.

### 4. Use the app

Open `http://localhost:5173`, sign up with an email + password, and start chatting.

---

## API Endpoints

Base URL: `http://localhost:8080`

### Auth (`/api/auth`)

| Method | Endpoint  | Description          |
| ------ | --------- | -------------------- |
| POST   | `/signup` | Create a new account |
| POST   | `/login`  | Log in (sets cookie) |
| POST   | `/logout` | Clear auth cookie    |
| GET    | `/me`     | Get current user     |

### User (`/api/user`) — auth required

| Method | Endpoint    | Description                  |
| ------ | ----------- | ---------------------------- |
| PUT    | `/profile`  | Update name / email          |
| PUT    | `/password` | Change password              |
| PUT    | `/theme`    | Update theme (dark / light)  |
| DELETE | `/threads`  | Delete all chat threads      |
| DELETE | `/`         | Delete account + all threads |

### Chat (`/api`) — auth required

| Method | Endpoint            | Description                               |
| ------ | ------------------- | ----------------------------------------- |
| GET    | `/thread`           | List all threads for current user         |
| GET    | `/thread/:threadId` | Get messages in a thread                  |
| DELETE | `/thread/:threadId` | Delete a thread                           |
| POST   | `/chat`             | Send a message and receive a Gemini reply |

---

## Deployment Notes

- Set `NODE_ENV=production` on the backend so cookies use `Secure` + `SameSite=None`.
- Set `CLIENT_ORIGIN` on the backend to the deployed frontend URL.
- Set `VITE_API_URL` on the frontend to the deployed backend URL **before** running `npm run build`.
- For the cross-site cookie auth to work in production, both frontend and backend must be served over **HTTPS**.

---

This project is for educational purposes.
