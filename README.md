# 🚀 SchemeSathi — AI Government Scheme Assistant

An AI-powered platform that helps citizens discover government schemes they are eligible for, simplifying welfare access with natural language processing and a custom matching engine.

---

## 📌 Project Overview & Hackathon Vision

**SchemeSathi** is a premium, AI-powered Government Scheme Recommendation Platform designed to bridge the gap between citizens and government welfare programs. 

In India, thousands of Central and State government welfare schemes exist to support students, farmers, women, and small businesses. However, millions of people remain unaware of their eligibility because information is scattered across multiple portals, written in complex legal/administrative language, and hard to query. 

**SchemeSathi** solves this by acting as a personal AI assistant. A user describes their situation in simple, natural language:
> *"I am a 25-year-old graduate from Andhra Pradesh. My family income is 2.5 lakh per year, and I want to start a dairy business."*

The assistant automatically extracts the user's profile parameters using AI and matches them against our government schemes database, calculating eligibility scores and generating personalized document checklists.

---

## 🎯 Key Features

* **🤖 AI Profile Extraction (NLP):** Users can enter their profile details naturally in plain text. An AI agent extracts structured details (Age, Income, Education, State, Occupation, Gender, and Goals) automatically.
* **🎯 Custom Eligibility Matcher:** A deterministic, rules-based engine matches user profiles against database rules, eliminating AI hallucination for eligibility criteria.
* **📊 Eligibility Match Score:** Each scheme is ranked by a percentage match score based on criteria satisfaction.
* **📄 Integrated Document Checklist:** Shows the user exactly what documents they need to prepare (Aadhaar, PAN, Project Reports, Land Records) before applying.
* **🌍 Multilingual Accessibility:** Built to support English, Hindi, Telugu, Tamil, Kannada, and Malayalam.
* **📱 Ultra-Responsive UI:** Fully responsive design built to work flawlessly on low-end smartphones, tablets, and desktops alike.

---

## 🏗️ System Architecture

The following diagram illustrates the request flow:

```mermaid
graph TD
    User([User Input: Plain Text or Form]) -->|Sends query| Frontend[React Web Client]
    Frontend -->|POST /api/recommend| Backend[Node.js / Express API]
    Backend -->|Send raw text| AI[OpenAI Structured Output API]
    AI -->|Return JSON Profile| Backend
    Backend -->|Query DB| DB[(PostgreSQL Database)]
    DB -->|Return government schemes| Engine[Custom Eligibility Engine]
    Engine -->|Calculate weights & filter| Results[Ranked Recommendations]
    Results -->|JSON Response| Frontend
    Frontend -->|Display UI Cards & Checklist| User
```

---

## 🧠 The Recommendation Engine & Score Math

While OpenAI is used to extract the user's details, the matching logic is handled by a deterministic JavaScript engine to prevent hallucination. 

To be recommended for a scheme, the user **MUST meet the critical qualification filters** (Age, State, and Income limits). If they do not, they are immediately filtered out.

For qualified profiles, the engine calculates a **Match Score (up to 100%)** based on the following weights:

| Category | Description | Weight |
| :--- | :--- | :---: |
| **Age Eligibility** | User falls within the scheme's `min_age` and `max_age` range. | **20%** |
| **State Eligibility** | User resides in the scheme's target state or it is an "All India" scheme. | **20%** |
| **Income Eligibility** | User's income is less than or equal to the scheme's `income_limit`. | **15%** |
| **Education Match** | User's education level matches the scheme's requirements. | **15%** |
| **Goal Match** | User's goals align with the scheme's target sector (e.g. "Dairy", "Tech"). | **20%** |
| **Gender Match** | User's gender matches the target group (or scheme is "Any"). | **10%** |
| **Total** | | **100%** |

---

## 🛠️ Tech Stack

### Frontend
* **React.js (Vite):** Core library for UI construction.
* **Tailwind CSS:** Modern utility CSS framework for responsive layout design.
* **React Router:** For seamless single-page navigation.
* **Framer Motion:** High-fidelity, smooth UI animations.
* **Lucide React:** Icon pack.

### Backend & Database
* **Node.js & Express.js:** Fast, minimal backend web framework.
* **PostgreSQL:** Reliable relational SQL database storage.
* **pg-pool:** Efficient connection pooling for database queries.
* **Auto-Migrations & Seeding:** On server start, if `DATABASE_URL` is set, the server runs `server/database/migration.sql` automatically and seeds the database with default schemes from `server/seed/government_schemes.json` if empty.

### AI Integration
* **OpenAI API:** Utilizing **GPT-4o-mini** with **Structured JSON Schema Outputs** to extract clean profiles from conversational inputs.

---

## 📂 Project Structure

```
SchemeSathi/
├── client/                     # React Frontend App
│   ├── src/
│   │   ├── components/         # Reusable UI parts (Header, Autocomplete, Toast)
│   │   ├── pages/              # Main Screens (HomePage, RecommendationsPage)
│   │   ├── services/           # Axios HTTP API Service clients
│   │   ├── App.jsx             # Main router and app shell
│   │   └── index.css           # Global Tailwind & Custom CSS
│   └── package.json
│
├── server/                     # Express Backend API
│   ├── controllers/            # API Route controller handlers
│   ├── database/               # Database pool, migration.sql, and init.js
│   ├── routes/                 # Express API routes definition
│   ├── seed/                   # Pre-defined government scheme JSON seeds
│   ├── services/               # Eligibility calculator & AI extractors
│   ├── server.js               # Entry-point script
│   └── package.json
│
├── docker-compose.yml          # Container configuration for local testing
└── README.md                   # Project documentation
```

---

## 🚀 Installation & Run Guide (Beginner Friendly)

### 1. Prerequisites
Make sure you have installed:
* [Node.js](https://nodejs.org/) (Version 18 or above)
* [Git](https://git-scm.com/)
* [PostgreSQL](https://www.postgresql.org/) (Local database or a hosted solution like Supabase/Neon/Render Postgres)

### 2. Clone the Repository
Open a terminal and run:
```bash
git clone https://github.com/Naiduchandrasekhar/SchemeSathi.git
cd SchemeSathi
```

---

### 3. Setup Backend Service

1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Create your environment variable file by copying the template:
   ```bash
   cp .env.example .env
   ```
4. Open the `.env` file in an editor and configure your variables:
   ```env
   PORT=5001
   
   # PostgreSQL Connection URI (e.g. from local PG or hosted PG)
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/schemesathi
   
   # OpenAI Key for Structured profile extraction
   OPENAI_API_KEY=your_openai_api_key_here
   ```
5. Run the server in development mode:
   ```bash
   npm run dev
   ```
   *Note: On boot, the server will connect to PostgreSQL, automatically execute `migration.sql` to create the table, and seed it with 10+ standard welfare schemes if it is empty!*

---

### 4. Setup Frontend Client

1. Open a new terminal window and navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the address shown (usually `http://localhost:5173`).

---

## 💡 End-to-End Walkthrough (Try This Example!)

To see the intelligence of **SchemeSathi** in action, input the following test case:

### 1. Input Profile Details
Either type this text in the AI Box or fill it in the manual forms:
* **Age:** `25`
* **Family Income:** `250000` (2.5 Lakh per annum)
* **State:** `Andhra Pradesh`
* **Gender:** `Female`
* **Education:** `Graduate`
* **Goal/Occupation:** `Start Dairy Business`

### 2. The Behind-the-Scenes Match Math
Here is how the backend matches the schemes in the database:

#### A. **Andhra Pradesh YSR Rythu Bharosa**
* **Age (25):** Falls inside target range (18–100) ➔ **Eligible (20%)**
* **State (Andhra Pradesh):** Matches scheme state ➔ **Eligible (20%)**
* **Income (250,000):** Less than the limit of 500,000 ➔ **Eligible (15%)**
* **Gender (Female):** Scheme is "Any" ➔ **Eligible (10%)**
* **Education (Graduate):** Scheme is "Any" ➔ **Eligible (15%)**
* **Goal (Start Dairy Business):** matches business categories `["Agriculture", "Dairy Business"]` ➔ **Eligible (15%)**
* **Occupation (Farmer):** Matches criteria ➔ **Eligible (5%)**
* **Total score:** **100% Match!** 🎉

#### B. **Pradhan Mantri MUDRA Yojana**
* **Age (25):** Falls inside target range (18–65) ➔ **Eligible (20%)**
* **State (Andhra Pradesh):** Scheme is "All India" ➔ **Eligible (20%)**
* **Income (250,000):** Scheme has no income limit ➔ **Eligible (15%)**
* **Gender (Female):** Scheme is "Any" ➔ **Eligible (10%)**
* **Education (Graduate):** Scheme is "Any" ➔ **Eligible (15%)**
* **Goal (Start Dairy Business):** matches business categories `["Dairy Business", "Micro Enterprise", "Retail"]` ➔ **Eligible (15%)**
* **Occupation (Farmer):** Matches criteria ➔ **Eligible (5%)**
* **Total score:** **100% Match!** 🎉

---

## 🔌 API Endpoints Reference

### 1. Get All Schemes
Fetch list of all schemes in the database.
* **Endpoint:** `GET /api/schemes`
* **Response:** Array of government scheme objects.

### 2. Get Single Scheme
Retrieve details of a scheme by ID.
* **Endpoint:** `GET /api/schemes/:id`

### 3. Match and Recommend Schemes
Find eligible schemes and calculate eligibility match percentages.
* **Endpoint:** `POST /api/recommend`
* **Payload:**
  ```json
  {
    "age": 25,
    "state": "Andhra Pradesh",
    "education": "Graduate",
    "income": 250000,
    "gender": "Female",
    "goal": "Start Dairy Business"
  }
  ```
* **Response:**
  ```json
  [
    {
      "scheme": "Andhra Pradesh YSR Rythu Bharosa",
      "eligibility_score": 100,
      "reason": [
        "Age eligible",
        "State eligible",
        "Income eligible",
        "Gender criteria satisfied",
        "Education criteria satisfied",
        "Occupation criteria satisfied",
        "Business type matches"
      ],
      "benefits": ["Annual farmer investment support"],
      "documents": ["Aadhaar", "Land records", "Bank details"],
      "application_process": "Apply through local agriculture authorities.",
      "official_link": "https://apagrisnet.gov.in/"
    }
  ]
  ```

---

## 🔮 Future Improvements

1. **Aadhaar Document OCR:** Allow users to upload their Aadhaar/PAN cards and use AI text recognition to autofill their age, gender, state, and name.
2. **Interactive Voice Assistant:** Voice-to-text queries in regional accents to assist users who cannot read or write.
3. **Automatic Application Assistance:** Integration with official API endpoints to directly forward user documents to block officers.
4. **Push Notifications:** Direct updates/alerts when new schemes matching their profile are announced by state governments.

---

## 👨‍💻 Author

**Naidu Chandrasekhar**
* **GitHub:** [Naiduchandrasekhar](https://github.com/Naiduchandrasekhar)

---

## 📄 License
This project is licensed under the MIT License — created for educational and hackathon purposes.
