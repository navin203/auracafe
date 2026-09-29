# AuraCafe Frontend

> Production-ready React.js Single Page Application for **AuraCafe** — AI-Powered Online Cafe Finder, Google Maps Search, Recommendation, and Side-by-Side Comparison Platform.

---

## 🚀 Features

- **Interactive Google Map**: Dark-slate styling, bi-directional pin highlighting with cafe cards list, and turn-by-turn navigation.
- **Split-Screen Desktop & Responsive Mobile**: Desktop 3-column layout (`[ Filters | List | Map ]`) and mobile toggle between List and Map view.
- **Side-by-Side Cafe Comparison**: Compare 2 to 5 cafes with detailed feature matrix and transparent App Comparison Scoring.
- **Supabase Authentication**: User registration, login, profile management, saved favorite cafes, and past search history.
- **Micro-Animations & Modern Aesthetics**: Warm coffee glow, glassmorphism, skeleton loading states, and accessible components.

---

## 🛠️ Environment Variables

Create `.env` based on `.env.example`:

```env
# Backend API Base URL (Leave as /api in dev with Vite proxy, or set to your deployed backend URL)
VITE_API_BASE_URL=/api

# Optional: Google Maps JavaScript API Key (If omitted, client auto-fetches it from backend /api/cafes/config)
VITE_GOOGLE_MAPS_API_KEY=

# Supabase Client Credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key
```

---

## 📦 Run Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
