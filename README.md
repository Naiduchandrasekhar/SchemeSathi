# 🚀 SchemeSathi — AI Government Scheme Assistant

An AI-powered platform that helps citizens discover government schemes they are eligible for.

## 📌 About The Project

**SchemeSathi** is an AI-powered Government Scheme Recommendation Platform designed to bridge the gap between citizens and government welfare programs.

Millions of people in India are unaware of the government schemes available for them because information is scattered across multiple portals and often written in complex language.

SchemeSathi simplifies this process.

Users can describe their situation in simple language:

> "I am a 24-year-old engineering graduate from Andhra Pradesh looking to start a dairy business."

The platform understands the user's profile and recommends suitable government schemes based on:

- Age
- State
- Education
- Income
- Gender
- Occupation
- Business goals
- Category requirements

The system provides:

✅ Eligible government schemes  
✅ Eligibility score  
✅ Reason for eligibility  
✅ Benefits  
✅ Required documents  
✅ Application process  
✅ Official application links  

---

# 🎯 Problem Statement

India has thousands of Central and State government schemes for:

- Students
- Farmers
- Entrepreneurs
- Women
- Senior citizens
- Startups
- Small businesses
- Healthcare support
- Education assistance

However, many eligible citizens do not know these schemes exist.

People spend hours searching different government websites to find relevant information.

---

# 💡 Solution

SchemeSathi acts as a personal AI government scheme assistant.

The user simply explains their situation.

The AI:

1. Extracts user information
2. Understands their requirements
3. Matches them with available schemes
4. Calculates eligibility
5. Explains everything in simple language

---

# ✨ Features

## 🤖 AI Profile Extraction

Users can enter information naturally.

Example:

```
I am a 25 year old graduate from Telangana.
My family income is 3 lakh per year.
I want to start a small food business.
```

AI extracts:

```json
{
  "age":25,
  "state":"Telangana",
  "education":"Graduate",
  "income":300000,
  "goal":"Food Business"
}
```

---

## 🎯 Smart Scheme Recommendation

The recommendation engine checks:

- Age eligibility
- State availability
- Income criteria
- Education requirements
- Gender eligibility
- Business category

and returns suitable schemes.

---

## 📊 Eligibility Score

Each scheme receives a matching score.

Example:

```
PMEGP

Eligibility Score: 96%

✔ Age matches
✔ Business category matches
✔ Income criteria satisfied
✔ Education requirement satisfied
```

---

## 📄 Document Checklist

Users can see required documents before applying.

Example:

```
Required Documents:

✓ Aadhaar Card
✓ PAN Card
✓ Income Certificate
✓ Bank Account Details
✓ Project Report
```

---

## 🌍 Multilingual Support

The platform is designed to support regional languages.

Supported languages:

- English
- Hindi
- Telugu
- Tamil
- Kannada
- Malayalam

---

## 📱 Responsive Design

Works across:

- Mobile phones
- Tablets
- Laptops
- Desktop screens

---

# 🏗️ System Architecture

```
User
 |
 |
React Frontend
 |
 |
Node.js API
 |
 |
AI Profile Extraction
(OpenAI API)
 |
 |
Eligibility Recommendation Engine
 |
 |
Government Scheme Database
 |
 |
Personalized Results
```

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Tailwind CSS
- React Router
- React Hook Form
- Framer Motion
- Lucide React

## Backend

- Node.js
- Express.js

## Database

- PostgreSQL

## Artificial Intelligence

- OpenAI API

AI is used only for:

- Extracting structured user information
- Understanding natural language input

The final recommendation decision is handled by the custom eligibility engine.

---

# 📂 Project Structure

```
SchemeSathi/

│
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── database/
│   └── package.json
│
├── docker-compose.yml
│
└── README.md
```

---

# 🚀 Getting Started

Follow these steps to run SchemeSathi locally.

## Prerequisites

Install:

- Node.js (v18+)
- npm
- PostgreSQL
- Git

Check versions:

```bash
node -v
npm -v
```

---

# 1. Clone Repository

```bash
git clone https://github.com/Naiduchandrasekhar/SchemeSathi.git
```

Go inside project:

```bash
cd SchemeSathi
```

---

# 2. Setup Backend

Navigate to server:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create environment file:

Copy:

```
.env.example
```

Rename to:

```
.env
```

Add your configuration:

```
PORT=5000

DATABASE_URL=your_postgresql_connection

OPENAI_API_KEY=your_openai_key
```

Start backend:

```bash
npm run dev
```

Server runs on:

```
http://localhost:5000
```

---

# 3. Setup Frontend

Open another terminal.

Navigate:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start React application:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🔌 API Endpoints

## Get All Schemes

```
GET /api/schemes
```

---

## Recommend Schemes

```
POST /api/recommend
```

Example request:

```json
{
 "age":29,
 "state":"Andhra Pradesh",
 "education":"Engineering",
 "income":250000,
 "gender":"Male",
 "goal":"Start Dairy Business"
}
```

---

# 🧠 Recommendation Logic

The eligibility engine calculates scores using:

| Criteria | Weight |
|---|---:|
| Age Match | 20% |
| State Match | 20% |
| Income Match | 15% |
| Education Match | 15% |
| Goal Match | 20% |
| Gender Match | 10% |

Total:

```
100%
```

---

# 🎯 Future Improvements

- Aadhaar document OCR
- Voice-based assistant
- More regional languages
- Real-time government scheme updates
- Mobile application
- Personalized scheme reminders
- Government portal integrations

---

# 🏆 Hackathon Vision

SchemeSathi aims to make government benefits accessible to everyone by using AI to simplify discovery, eligibility checking, and application guidance.

Technology should reduce the distance between citizens and opportunities.

---

# 👨‍💻 Author

**Naidu Chandrasekhar**

GitHub:

https://github.com/Naiduchandrasekhar

---

# 📄 License

This project is created for educational and hackathon purposes.
