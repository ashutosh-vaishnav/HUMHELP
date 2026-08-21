# HUMHELP NGO — Full Stack NGO Management System

HUMHELP NGO is a modern, transparent, and responsive full-stack web application designed for non-profit organizations. It connects compassionate donors with verified community projects, providing real-time donation progress tracking, volunteer profile registration, success stories reporting, contact inquiry logs, and an integrated admin control center.

## 🚀 Key Features

* **Real-time Crowdfunding & Causes Grid**: Displays ongoing community campaigns (Education, Clean Water, Food & Hunger, Healthcare, Women Empowerment, Disaster Relief) with dynamic progress bars based on verified MongoDB transaction updates.
* **Secured Dual-Mode Payments Checkout**: Supports Indian payment processing via Razorpay. It includes an automated **simulation fallback mode** for demo runs or environments where active secret tokens are missing.
* **Instant Printable Tax-Exempt Receipts**: Automatically generates a unique Donation ID, verified stamps, and section 80G tax benefit claim info post-transaction, which can be printed directly from the browser.
* **Comprehensive Volunteer Directory**: Users can register profiles selecting skills, availability, and specific interest tracks (e.g. food distribution, technology, social media).
* **Published Success Stories**: Chronicles verified, audited social impact achievements to close the loop on donor transparency.
* **Newsletter Subscriptions**: Quick-capture email subscriptions stored in dedicated database collections.
* **Robust Admin Control Workspace**:
  - **Overview Dashboard**: Graphical summaries of total funds raised, volunteer counts, campaign progressions, and category distributions.
  - **Donations Directory**: Fully searchable and filterable database tracking verified transactions.
  - **Volunteer Management**: Approve, reject, or delete applications with live status reflections.
  - **Campaign Editor**: Add new causes, modify target numbers, adjust status (active/inactive), and change images.
  - **Stories Writer**: Draft, write, edit, and publish success stories.
  - **Inbound Message Box**: Read queries, flag read/replied status, and clean records.

---

## 🛠️ Technology Stack

* **Frontend**: React.js, React Router v6, Tailwind CSS, Axios, Lucide React (Icons), Vite
* **Backend**: Python 3.13, Flask REST API, Flask-CORS, PyJWT, Werkzeug (Password hashing), Razorpay
* **Database**: MongoDB (via PyMongo Python driver)
* **Deployment compatibility**: Vercel-ready serverless function wrappers (`api/index.py`, `vercel.json`)

---

## 📁 Directory Structure

```text
HUMHELP-NGO/
├── .env.example              # Template for system configurations
├── .env.local                # Local environment secrets (ignored by git)
├── .gitignore                # standard version control omissions
├── requirements.txt          # Python dependencies
├── vercel.json               # Vercel Serverless deployments mapper
│
├── api/
│   └── index.py              # Serverless entrypoint to Python Flask app
│
├── backend/
│   ├── routes/
│   │   ├── admin.py          # Dashboard statistical aggregates
│   │   ├── auth.py           # Admin authentication login handler
│   │   ├── causes.py         # Campaigns CRUD operations
│   │   ├── contacts.py       # Queries inbox & newsletter endpoints
│   │   ├── donations.py      # Donations list & public metrics
│   │   ├── payment.py        # Gateway order creation & verify signature
│   │   ├── volunteers.py     # Volunteer sign-ups & management
│   │   └── stories.py        # Success stories CRUD
│   │
│   ├── models/
│   │   └── db.py             # MongoDB PyMongo driver client initialization
│   ├── utils/
│   │   └── auth_helper.py    # JWT encoders & token decorators
│   ├── app.py                # Main Flask setup and CORS wrappers
│   ├── config.py             # Configuration properties loader
│   ├── create_admin.py       # CLI script to register the first admin
│   └── seed_data.py          # Database seeding script
│
└── frontend/
    ├── index.html            # Main site markup template
    ├── package.json          # React libraries and builder tasks
    ├── tailwind.config.js    # Tailwind brand color definitions
    ├── postcss.config.js     # PostCSS autoprefixer config
    ├── vite.config.js        # Vite dev server proxy routing
    └── src/
        ├── App.jsx           # React app router coordinates
        ├── main.jsx          # DOM entry mount point
        ├── index.css         # Styling directives and scrollbar adjustments
        ├── layouts/
        │   ├── RootLayout.jsx  # Main visitor navigation & footer
        │   └── AdminLayout.jsx # Session controller & dashboard frames
        ├── services/
        │   └── api.js        # Axios instance configured with JWT interceptors
        └── pages/
            ├── Home.jsx      # Marketing hero and focus pillars
            ├── About.jsx     # Our mission, values and operations workflow
            ├── Causes.jsx    # Progress grid of funding campaigns
            ├── Impact.jsx    # Graphical funds allocation & transparency
            ├── Stories.jsx   # Grid of published success logs
            ├── Volunteer.jsx # Volunteer application profile form
            ├── Contact.jsx   # Address indices, messaging and FAQs
            ├── Donate.jsx    # checkout panels and payment modals
            ├── AdminLogin.jsx # Administrator login form
            └── AdminDashboard.jsx # Administration unified panel workspace
```

---

## ⚙️ Installation & Local Setup

### Step 1: Database Setup
1. Ensure you have **MongoDB Community Server** running locally on the default port `27017` (URI: `mongodb://localhost:27017/humhelp`).
2. Alternatively, create a free database cluster on **MongoDB Atlas** and fetch your connection string URI.

### Step 2: Environment Variables
Create a file named `.env.local` at the project root directory:
```bash
# MongoDB connection URI (default fallback is local)
MONGO_URI=mongodb://localhost:27017/humhelp

# Flask JWT Secret Key
JWT_SECRET=supersecretjwtkeyforhumhelpngo123

# Razorpay Keys (Leave blank to use Simulated Demo payment flow)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# API URL for Frontend
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 3: Backend Setup
1. Navigate to the root directory `C:\Users\HP\.gemini\antigravity\scratch\humhelp-ngo`.
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. **Seed the database** with sample campaigns, success stories, and historical donations:
   ```bash
   python backend/seed_data.py
   ```
5. **Create your initial admin credentials** securely:
   ```bash
   python backend/create_admin.py
   ```
6. Run the local Flask server:
   ```bash
   python backend/app.py
   ```
   The API server will listen on [http://localhost:5000](http://localhost:5000).

### Step 4: Frontend Setup
1. Open a new terminal window and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the local Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser to [http://localhost:3000](http://localhost:3000) (as configured in the Vite proxy).

---

## 💳 Payment Gateway Integration (Razorpay)

* **Production/Real Mode**: Provide your keys (`RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`) in `.env.local`. Ensure you load the script `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>` or let the gateway handle checkout overlays.
* **Simulated/Mock Mode**: Leave the keys empty in `.env.local`. When clicking pay, the app triggers a clean React UI overlay simulating authorization status.

---

## ☁️ Deployment Instructions

### Frontend (Vercel)
The structure of this project is fully Vercel compatible:
1. Initialize a Git repository and push the monorepo to GitHub.
2. Link the repository to your Vercel Dashboard.
3. Configure the directory as a monorepo or set **Root Directory** as the root folder.
4. Set the **Framework Preset** to `Vite`.
5. Add your `.env.local` values in the Vercel project Settings under **Environment Variables**.
6. Deploy. The `vercel.json` and `api/index.py` files route `/api/*` requests to the Flask serverless functions and other requests to the React build files.

---

## 🛡️ Security Notes
* Never commit `.env.local` to public repositories. It is ignored by default in `.gitignore`.
* Passwords are encrypted utilizing Werkzeug `pbkdf2` algorithms before write operations.
* Admin panel routes are protected using client interceptors validating JWT signatures.
