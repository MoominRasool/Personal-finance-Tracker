Personal Finance Tracker - Web Application

Requirements
- Node.js (LTS). npm included.
- MongoDB (local service) or MongoDB Atlas connection string.

Project Structure
- server: Node.js/Express API with MongoDB (Mongoose)
- client: React + Vite frontend with Chart.js

Setup - Backend
1) Copy server/.env.example to server/.env and set:
   - MONGO_URI=mongodb://localhost:27017/pft (or Atlas URI)
   - JWT_SECRET=change_me
   - PORT=4000
2) Install deps and run:
   - cd server
   - npm install
   - npm run dev (or: node src/index.js)
3) Health check: http://localhost:4000/api/health

Setup - Frontend
1) Create client/.env and set:
   - VITE_API_URL=http://localhost:4000
2) Install deps and run:
   - cd client
   - npm install
   - npm run dev

Usage
- Register then login in the frontend.
- Dashboard shows charts and forms to add expenses and budgets.

Change Tech Choices
- DB: swap to PostgreSQL with Prisma if desired.
- UI: add Tailwind or Material UI for styling.


