# AuraCafe | AI-Powered Real Online Cafe Finder & Comparison Platform

> Production-ready, full-stack web application connecting directly to official **Google Maps Platform** and **Google Places APIs** with side-by-side comparison, transparent App Comparison Scoring, and Supabase database authentication.

---

## 🌟 Key Features

1. **Real Google Places Integration (No Mock Data)**:
   - Queries Google Places API directly for live cafe names, Google ratings, review counts, distances, formatted addresses, price tiers, opening hours, photos, and phone numbers.
   - Strictly displays *"Not available"* or hides missing fields if Google doesn't provide them.
2. **Interactive Google Maps Display**:
   - High-tech dark theme map styling matching the cafe aesthetic.
   - Dynamic marker synchronization: clicking or hovering a cafe card pans the map and highlights the pin; clicking a marker opens an InfoWindow and selects the cafe card.
   - User GPS location marker with turn-by-turn Google Maps Directions links.
3. **Split-Screen Search Layout**:
   - Desktop 3-column split view: `[ Filter Panel | Cafe List | Interactive Map ]`.
   - Mobile responsive toggle between `List View` and `Map View` with collapsible filters.
4. **Side-by-Side Comparison Engine**:
   - Select 2 to 5 cafes from the list or map.
   - Dedicated side-by-side comparison table contrasting ratings, reviews, distance, price level, open/closed status, hours, phone, and links.
   - Factual Comparison Summary explaining differences strictly using real data.
5. **Transparent Recommendation Scoring**:
   - Computes the **App Comparison Score** (0–100) using configurable user preference weights (`Balanced`, `Highest Rated`, `Closest`, `Budget Friendly`, `Most Reviewed`, `Currently Open`, `Study`, `Meeting`, `Casual`).
   - Clearly explains *"Why this cafe matches your preferences"* with transparent component weighting.
6. **Supabase User Accounts & RLS Security**:
   - Registration, Login, Logout, Profile management with Supabase Auth.
   - Bookmarked Favorites, Search History, and Saved Comparisons secured with PostgreSQL Row Level Security (RLS) policies.
   - Scoped JWT authentication preventing unauthorized cross-user data access.

---

## 🏗️ Architecture & Project Structure

The codebase is strictly separated into two independent folders following MVC design principles:

```text
/map
├── backend/
│   ├── config/              # Environment & Supabase client config
│   │   ├── env.js
│   │   └── supabase.js
│   ├── controllers/         # Request & response controllers (MVC)
│   │   ├── auth.controller.js
│   │   ├── cafe.controller.js
│   │   ├── comparison.controller.js
│   │   ├── favorite.controller.js
│   │   ├── history.controller.js
│   │   └── user.controller.js
│   ├── database/
│   │   └── schema.sql       # Supabase SQL schema + Row Level Security policies
│   ├── middleware/          # JWT auth, validation, rate limiting & error handling
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── rateLimiter.middleware.js
│   │   └── validate.middleware.js
│   ├── models/              # Database operations interacting with Supabase (MVC)
│   │   ├── comparison.model.js
│   │   ├── favorite.model.js
│   │   ├── history.model.js
│   │   └── profile.model.js
│   ├── routes/              # Express REST API routes
│   │   ├── auth.routes.js
│   │   ├── cafe.routes.js
│   │   ├── comparison.routes.js
│   │   ├── favorite.routes.js
│   │   ├── history.routes.js
│   │   └── user.routes.js
│   ├── services/            # External API & Business Logic
│   │   ├── comparison.service.js      # Factual comparison generator
│   │   ├── googlePlaces.service.js    # Google Places & Geocoding API client
│   │   └── recommendation.service.js  # Transparent App Comparison Score engine
│   ├── utils/               # Distance calculation, response helpers
│   ├── .env.example
│   ├── package.json
│   └── server.js            # Express application entry point
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   │   ├── CafeCard.jsx
    │   │   ├── CafeList.jsx
    │   │   ├── CafeMap.jsx
    │   │   ├── CompareDock.jsx
    │   │   ├── ComparisonSummary.jsx
    │   │   ├── ComparisonTable.jsx
    │   │   ├── ErrorMessage.jsx
    │   │   ├── FilterPanel.jsx
    │   │   ├── LoadingSkeleton.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── SearchBar.jsx
    │   │   └── SortPanel.jsx
    │   ├── context/         # React Context state management
    │   │   ├── AuthContext.jsx
    │   │   ├── ComparisonContext.jsx
    │   │   └── SearchContext.jsx
    │   ├── hooks/           # Custom React hooks (useGeolocation)
    │   ├── pages/           # Application views / routes
    │   │   ├── CafeDetailsPage.jsx
    │   │   ├── ComparePage.jsx
    │   │   ├── FavoritesPage.jsx
    │   │   ├── HistoryPage.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── MapPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── SearchPage.jsx
    │   ├── services/        # Frontend API & Supabase services
    │   ├── utils/           # Formatters & Google Maps script helpers
    │   ├── App.jsx          # Route declarations & layout
    │   ├── index.css        # Design system & dark glassmorphism styles
    │   └── main.jsx         # React DOM mount point
    ├── .env.example
    ├── index.html
    ├── package.json
    └── vite.config.js       # Vite build config with /api proxy
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **Google Cloud Console account**: With Places API, Geocoding API, and Maps JavaScript API enabled
- **Supabase account**: PostgreSQL project for user authentication and relational tables

---

### 2. Google Cloud Platform Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project.
3. In **APIs & Services → Library**, enable the following APIs:
   - **Places API** (for Text Search, Nearby Search, Place Details, Place Photos)
   - **Geocoding API** (for translating location names like "Misrod Bhopal" to GPS coordinates)
   - **Maps JavaScript API** (for interactive map rendering and marker pins in browser)
4. Go to **APIs & Services → Credentials** and create an **API Key**.
5. *(Recommended for production)*: Under API restrictions, restrict the key to the 3 APIs above.

---

### 3. Supabase Setup

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. In the Supabase dashboard, navigate to the **SQL Editor**.
3. Copy the entire contents of [`backend/database/schema.sql`](file:///c:/Users/Navin%20kumar%20patre/Desktop/map/backend/database/schema.sql) and paste it into the SQL Editor.
4. Click **Run**. This will create:
   - `profiles` table (with automated trigger on new signups)
   - `favorites` table (stores bookmarked cafes by `place_id`)
   - `search_history` table (logs past search queries)
   - `saved_comparisons` & `comparison_cafes` tables
   - All necessary indexes and Row Level Security (RLS) policies.
5. In Supabase **Project Settings → API**, copy:
   - **Project URL**
   - **Project API Keys (`anon` / public)**
   - **Project API Keys (`service_role` / secret)**

---

### 4. Backend Environment Configuration

In the `backend` folder, create a `.env` file (or edit the existing one):

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Google Maps / Places API Key (Must have Places API & Geocoding API enabled)
GOOGLE_MAPS_API_KEY=your_google_api_key_here
GOOGLE_PLACES_API_KEY=your_google_api_key_here

# Supabase Project Credentials (from Supabase Dashboard -> Settings -> API)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

JWT_SECRET=super_secret_cafe_finder_jwt_key_2026
```

---

### 5. Frontend Environment Configuration

In the `frontend` folder, create a `.env` file:

```env
VITE_API_BASE_URL=/api

# Optional: Google Maps JavaScript API Key (If empty, frontend automatically gets it from backend config)
VITE_GOOGLE_MAPS_API_KEY=

# Supabase Client Credentials
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

---

## 💻 Running the Application

### Start the Backend Server:
Open a terminal in `/backend`:
```bash
cd backend
npm run dev
# Or: node server.js
```
The backend server runs on `http://localhost:5000`.

### Start the Frontend Dev Server:
Open a second terminal in `/frontend`:
```bash
cd frontend
npm run dev
```
The frontend application will be live at `http://localhost:5173`.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service health status check | No |
| `GET` | `/api/cafes/search` | Search cafes by text query or location | Optional |
| `GET` | `/api/cafes/nearby` | Search cafes around GPS coordinates | Optional |
| `GET` | `/api/cafes/config` | Client-safe public maps configuration | No |
| `GET` | `/api/cafes/photo` | Proxy Google Place photos securely | No |
| `GET` | `/api/cafes/:placeId` | Get detailed cafe profile from Google | Optional |
| `POST` | `/api/cafes/compare` | Compare 2–5 cafes with factual scoring | Optional |
| `POST` | `/api/auth/register` | Register new user via Supabase | No |
| `POST` | `/api/auth/login` | Sign in with email & password | No |
| `POST` | `/api/auth/logout` | Sign out active session | Yes |
| `GET` | `/api/auth/me` | Get current user profile | Yes |
| `GET` | `/api/favorites` | List user's saved cafes | Yes |
| `POST` | `/api/favorites` | Add cafe to favorites | Yes |
| `DELETE` | `/api/favorites/:placeId` | Remove cafe from favorites | Yes |
| `GET` | `/api/search-history` | Get user's search history | Yes |
| `DELETE` | `/api/search-history` | Clear all search history | Yes |
| `GET` | `/api/comparisons` | List saved comparisons | Yes |
| `POST` | `/api/comparisons` | Save a side-by-side comparison | Yes |
| `DELETE` | `/api/comparisons/:id` | Delete saved comparison | Yes |

---

## 🛡️ Transparent Recommendation Scoring Formula

The **App Comparison Score** (0–100) evaluates cafes strictly based on real Google Places data:
$$\text{Score} = w_{\text{rating}} \cdot S_{\text{rating}} + w_{\text{reviews}} \cdot S_{\text{reviews}} + w_{\text{distance}} \cdot S_{\text{distance}} + w_{\text{price}} \cdot S_{\text{price}} + w_{\text{open}} \cdot S_{\text{open}}$$

When the user selects a preference:
- **Closest**: Distance weight increases to **50%**.
- **Highest Rated**: Rating weight increases to **50%**.
- **Budget Friendly**: Price tier affordability increases to **45%**.
- **Most Reviewed**: Review volume weight increases to **50%**.
- **Currently Open**: Live operating status increases to **40%**.
- **Study / Meeting / Casual**: Balanced composite prioritizing verified ratings, operating hours, and review volume.
- No artificial claims about wifi, noise level, or seating are invented unless verified in Google Places.
