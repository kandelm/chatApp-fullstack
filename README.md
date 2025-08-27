# ChatApp Fullstack

A modern fullstack chat application built with Node.js (Express), MySQL, Next.js (React), Docker, and Tailwind CSS.

## Features
- User registration and login (JWT authentication)
- Real-time chat between users (Socket.io)
- Conversations and messages stored in MySQL
- Image upload in chat
- Unread message notifications
- Responsive, professional UI with Tailwind CSS
- Dockerized for easy deployment

## Technologies
- **Backend:** Node.js, Express, Sequelize, MySQL
- **Frontend:** Next.js, React, Axios, Tailwind CSS
- **Real-time:** Socket.io
- **Containerization:** Docker, Docker Compose

## Getting Started

### Prerequisites
- Docker & Docker Compose installed
- Node.js & npm (for local development)

### Local Development
1. Clone the repository:
   ```sh
   git clone https://github.com/kandelm/chatApp-fullstack.git
   cd chatApp-fullstack
   ```
2. Configure environment variables:
   - Edit `backend/.env` for MySQL and JWT secrets
   - Edit `frontend/.env` for API URLs
3. Install dependencies:
   ```sh
   cd backend && npm install
   cd ../frontend && npm install
   ```
4. Start backend:
   ```sh
   cd backend
   npm run dev
   ```
5. Start frontend:
   ```sh
   cd ../frontend
   npm run dev
   ```
6. Visit [http://localhost:3000](http://localhost:3000)

### Docker Deployment
1. Build and start all services:
   ```sh
   docker compose up --build
   ```
2. The app will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure
```
chatApp-fullstack/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── uploads/
│   │   ├── app.js
│   │   └── index.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── frontend/
│   ├── pages/
│   ├── lib/
│   ├── styles/
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── docker-compose.yml
└── README.md
```

## Usage
- Register a new user and log in.
- See all users and start a chat by clicking their name.
- Send text and images in chat.
- Unread messages are shown as notification badges.
- Logout securely from the sidebar.

## Environment Variables
### Backend (`backend/.env`)
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=chatdb
DB_USER=chatuser
DB_PASS=chatpass
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```
### Frontend (`frontend/.env`)
```
NEXT_PUBLIC_API_BASE=http://localhost:4000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

## API Endpoints
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET /api/users` — List all users
- `GET /api/conversations` — List user's conversations
- `POST /api/conversations/start` — Start a new conversation
- `GET /api/messages/:conversationId` — Get messages for a conversation
- `POST /api/messages/:conversationId` — Send message (with optional image)

## Customization
- UI is built with Tailwind CSS. Edit `frontend/pages` and `frontend/styles` for custom styles.
- Backend uses Sequelize models. Add fields or relations in `backend/src/models`.

## License
MIT

## Author
- [kandelm](https://github.com/kandelm)
