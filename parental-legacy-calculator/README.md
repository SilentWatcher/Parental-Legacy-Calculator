# Parental Legacy & Life Factors Calculator

A full-stack MERN application that calculates Parental Legacy & Life Factors based on a user's Date of Birth. The application determines the balance between maternal and paternal genetic and spiritual inheritance patterns.

## Features

- **Date of Birth Input** — Custom DD/MM/YYYY picker with validation
- **Auto-Calculation** — Generates 7 life factors with Mother/Father/Total values
- **Grand Total = 100** — All values sum correctly to 100
- **Odd/Even Day Logic** — Odd days favor Mother, even days favor Father
- **Visual Charts** — Bar chart, radar chart, and pie charts (Recharts)
- **Dark/Light Mode** — Theme toggle with localStorage persistence
- **Export to PDF** — Download results as a formatted PDF (jsPDF)
- **Export to CSV** — Download results as a CSV spreadsheet
- **User Authentication** — JWT-based register/login (bcrypt + MongoDB)
- **Save Results** — Store calculation results in MongoDB
- **Calculation History** — View and delete past calculations
- **Responsive Design** — Works on desktop and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcryptjs |
| Export | jsPDF, jspdf-autotable |
| Charts | Recharts (Bar, Radar, Pie) |

## Project Structure

```
parental-legacy-calculator/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/auth.js     # JWT auth middleware
│   ├── models/User.js        # User schema
│   ├── models/Calculation.js # Calculation schema
│   ├── routes/auth.js        # Auth endpoints
│   ├── routes/calculations.js # Calculation CRUD
│   ├── server.js             # Express server
│   ├── .env                  # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── DateInput.jsx
│   │   │   ├── ResultsTable.jsx
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── Charts.jsx
│   │   │   └── ExportButtons.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── History.jsx
│   │   ├── utils/
│   │   │   ├── calculations.js
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
npm install
```

Configure `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parental-legacy
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

Start the server:
```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and proxies API requests to the backend on port 5000.

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/calculations` | Save calculation | Yes |
| GET | `/api/calculations` | Get all calculations | Yes |
| GET | `/api/calculations/:id` | Get one calculation | Yes |
| DELETE | `/api/calculations/:id` | Delete calculation | Yes |

## Calculation Logic

- 7 factors: Genetic Inheritance, Constitutional Vitality, Mental Patterns, Intellectual Capacity, Emotional Foundation, Spiritual Lineage, Soul Connections
- Each factor has a defined min/max range
- **Odd day of month**: Mother values are higher
- **Even day of month**: Father values are higher
- Mother Total + Father Total = Grand Total (100.000)
- Seeded random ensures same DOB always produces same results

