# Buyer Portal

A full-stack property listing and favourites application built with Next.js and NestJS.

---

## Tech Stack

**Frontend**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Mantine UI
- Axios

**Backend**
- NestJS
- TypeScript
- TypeORM
- MySQL
- JWT Authentication
- Bcrypt

---

## Project Structure

```
buyer-portal/
├── frontend/    # Next.js application (port 3000)
└── backend/     # NestJS application (port 4000)
```

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MySQL](https://www.mysql.com/) (v8 or higher)
- npm

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/michaelbahik75/buyer-portal.git
cd buyer-portal
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_NAME=buyer_portal

JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

Create the database in MySQL:

```sql
CREATE DATABASE buyer_portal;
```

Start the backend:

```bash
npm run start:dev
```

The backend will run on **http://localhost:4000**

> The database tables and sample property data will be created automatically on first run.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` root:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on **http://localhost:3000**

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and get JWT token | No |
| GET | `/auth/me` | Get current user | Yes |

### Properties
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/properties` | List all properties | Yes |

### Favourites
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/favourites` | Get user's favourites | Yes |
| POST | `/favourites/:id` | Add property to favourites | Yes |
| DELETE | `/favourites/:id` | Remove property from favourites | Yes |

---

## Features

- User registration and login with JWT authentication
- Passwords hashed with bcrypt — never stored as plain text
- Protected routes on both frontend and backend
- Browse all available properties
- Add and remove properties from personal favourites
- Favourites are scoped per user — users can only see and modify their own
- Optimistic UI updates on like/unlike
- Loading states and error messages throughout

---

## Usage

1. Open **http://localhost:3000**
2. Click **Signup** to create an account
3. Login with your credentials
4. Browse properties and click the heart icon to save favourites
5. View your saved properties in the **My Favourites** section
6. Click the heart again to remove from favourites

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `your_mysql_password` |
| `DB_NAME` | Database name | `buyer_portal` |
| `JWT_SECRET` | Secret key for JWT signing | `generate a random key` |
| `JWT_EXPIRES_IN` | JWT expiry duration | `7d` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend base URL | `http://localhost:4000/` |