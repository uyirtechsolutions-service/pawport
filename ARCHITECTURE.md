# Pawport Transport — Complete Architecture & Database Documentation

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Database Schema & Models](#database-schema--models)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [State Management](#state-management)
6. [API Integration Layer](#api-integration-layer)
7. [Authentication & Authorization](#authentication--authorization)
8. [Deployment & Configuration](#deployment--configuration)
9. [Project Structure](#project-structure)

---

## Technology Stack

### Frontend Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.6 | UI library for building component-based interfaces |
| React Router | 7.18.0 | Client-side routing and navigation |
| Vite | 8.0.12 | Build tool and development server |
| Tailwind CSS | 4.3.1 | Utility-first CSS framework |
| Zustand | 4.5.4 | Lightweight state management |
| Axios | 1.18.0 | HTTP client for API requests |
| Supabase JS | 2.49.1 | Supabase client library |

### Backend Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | Latest | JavaScript runtime environment |
| Express.js | ^4.21.0 | Web application framework |
| JWT (jsonwebtoken) | ^9.0.2 | Token-based authentication |
| Bcryptjs | ^2.4.3 | Password hashing |
| Supabase JS | 2.49.1 | Database client (PostgreSQL interface) |
| UUID | ^10.0.0 | UUID generation |

### Database Stack
| Technology | Purpose |
|-----------|---------|
| Supabase | Backend-as-a-Service platform |
| PostgreSQL | Relational database (via Supabase) |
| UUID-Ossp | UUID generation extension |

### Development Tools
| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| dotenv | Environment variable management |
| CORS | Cross-origin resource sharing |

---

## Database Schema & Models

The database uses **PostgreSQL** hosted on **Supabase** with **Row Level Security (RLS)** policies for data protection.

### Users Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Unique user identifier |
| name | VARCHAR(255) | NOT NULL | User's full name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| password | VARCHAR(255) | NOT NULL | Bcrypt-hashed password |
| phone | VARCHAR(20) | | Optional phone number |
| role | VARCHAR(50) | DEFAULT 'customer' | User role (customer/handler/admin) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

### Bookings Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Unique booking identifier |
| user_id | UUID | FK → users(id) ON DELETE CASCADE | Owner of the booking |
| pet_category | VARCHAR(100) | | Type of pet (Dog, Cat, etc.) |
| pet_name | VARCHAR(255) | | Pet's name |
| booking_date | DATE | | Preferred transport date |
| preferred_time | VARCHAR(100) | | Time window preference |
| pickup_place | VARCHAR(500) | NOT NULL | Origin location |
| dropoff_place | VARCHAR(500) | NOT NULL | Destination location |
| user_email | VARCHAR(255) | | Contact email for booking |
| user_name | VARCHAR(255) | | Contact name for booking |
| notes | TEXT | | Special instructions |
| status | VARCHAR(50) | DEFAULT 'pending' | pending / in-transit / completed / cancelled |
| handler_id | UUID | | Assigned handler |
| tracking_link | VARCHAR(500) | | Live tracking URL |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Booking creation time |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update time |

### Services Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Unique service identifier |
| service_num | VARCHAR(10) | | Display order number |
| title | VARCHAR(255) | NOT NULL | Service name |
| description | TEXT | | Service description |
| image_url | VARCHAR(500) | | Service image path |
| is_active | BOOLEAN | DEFAULT true | Whether service is available |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

### Service Tags Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Unique tag identifier |
| service_id | UUID | FK → services(id) ON DELETE CASCADE | Parent service |
| tag_name | VARCHAR(100) | NOT NULL | Tag label |

### Handlers Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Unique handler identifier |
| user_id | UUID | FK → users(id) ON DELETE CASCADE | Linked user account |
| certification | VARCHAR(255) | | Handler certification |
| vehicle_type | VARCHAR(100) | | Assigned vehicle |
| is_available | BOOLEAN | DEFAULT true | Availability status |
| rating | DECIMAL(2,1) | DEFAULT 5.0 | Handler rating |
| trips_completed | INTEGER | DEFAULT 0 | Total trips handled |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Registration timestamp |

### Tracking Updates Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Unique update identifier |
| booking_id | UUID | FK → bookings(id) ON DELETE CASCADE | Parent booking |
| status | VARCHAR(50) | NOT NULL | Current status |
| location | VARCHAR(500) | | GPS/location info |
| message | TEXT | | Status message |
| timestamp | TIMESTAMPTZ | DEFAULT NOW() | Update time |

### Row Level Security (RLS) Policies
| Table | Policy | Operation | Condition |
|-------|--------|-----------|-----------|
| users | Users read own data | SELECT | auth.uid() = id |
| users | Users update own data | UPDATE | auth.uid() = id |
| bookings | Users read own bookings | SELECT | auth.uid() = user_id |
| bookings | Users create own bookings | INSERT | auth.uid() = user_id |
| bookings | Users update own bookings | UPDATE | auth.uid() = user_id |
| bookings | Users delete own bookings | DELETE | auth.uid() = user_id |
| tracking_updates | Users read own tracking | SELECT | EXISTS via bookings join |

### Entity Relationship Diagram (Text)
```
┌──────────┐       ┌──────────────┐       ┌──────────────────┐
│  users   │──1:N──│   bookings   │──1:N──│ tracking_updates │
└──────────┘       └──────────────┘       └──────────────────┘
     │                      │
     │ 1:1 (optional)       │ N:1 (optional)
     ▼                      ▼
┌──────────┐       ┌──────────────┐
│ handlers │       │   services   │──1:N──│  service_tags  │
└──────────┘       └──────────────┘       └────────────────┘
```

---

## Backend Architecture

### Server Entry Point (server.js)
- **Express.js** application listening on port 5000 (configurable via `PORT` env)
- CORS configured for cross-origin requests from the frontend
- JSON body parsing middleware
- Modular route mounting under `/api` prefix
- Global error handling middleware

### Route Structure
| Route | Method | Auth Required | Description |
|-------|--------|---------------|-------------|
| `/api/health` | GET | No | Health check endpoint |
| `/api/auth/register` | POST | No | Register new user |
| `/api/auth/login` | POST | No | Login and receive JWT |
| `/api/auth/profile` | GET | Yes | Get authenticated user profile |
| `/api/bookings` | POST | Yes | Create a new booking |
| `/api/bookings` | GET | Yes | List all user bookings |
| `/api/bookings/:id` | GET | Yes | Get single booking detail |
| `/api/bookings/:id` | PUT | Yes | Update a booking |
| `/api/bookings/:id` | DELETE | Yes | Delete a booking |
| `/api/services` | GET | No | List all transport services |
| `/api/services/:id` | GET | No | Get single service detail |

### Middleware Chain
```
Request → CORS → JSON Parser → Route Handler → Error Handler → Response
                                    ↑
                              Auth Middleware (JWT)
```

### Authentication Flow
```
1. User sends POST /api/auth/register or /login with credentials
2. Server validates input
3. Password hashed with bcryptjs (salt rounds: 10)
4. User stored/retrieved from Supabase 'users' table
5. JWT generated with { id, email, name } payload (7-day expiry)
6. Token returned to client, stored in localStorage
7. Client attaches token via `Authorization: Bearer <token>` header
8. Auth middleware verifies token on protected routes
```

### Error Handling
- **400**: Validation errors (missing fields, invalid data)
- **401**: Authentication errors (missing/invalid token)
- **404**: Resource not found
- **500**: Internal server errors (with stack trace in development)

---

## Frontend Architecture

### Component Tree
```
App
├── Header (fixed nav with logo, links, auth actions, mobile menu)
├── Routes
│   ├── HomePage
│   │   ├── Hero (hero section with headline, CTA, images, pulse animation)
│   │   ├── Services (4 service cards grid)
│   │   ├── Process (5-step process timeline)
│   │   ├── Fleet (fleet & safety info band)
│   │   ├── Philosophy (quote with photo)
│   │   ├── Transports (recent trips grid)
│   │   └── BookingForm (booking form with email integration)
│   ├── BookingPage
│   │   └── BookingForm
│   ├── LoginPage (login form)
│   ├── RegisterPage (registration form)
│   └── DashboardPage (user bookings dashboard with stats)
└── Footer (site links, contact info)
```

### Page Routes
| Route | Page Component | Auth Required | Description |
|-------|---------------|---------------|-------------|
| `/` | HomePage | No | Landing page with all sections |
| `/book` | BookingPage | No | Standalone booking form |
| `/login` | LoginPage | No | User login |
| `/register` | RegisterPage | No | User registration |
| `/dashboard` | DashboardPage | Yes | User's booking dashboard |

### Component Details

**Header**
- Fixed position with background blur
- Logo with Pawport icon (SVG)
- Navigation links: Services, Process, Fleet, Transports
- Conditional auth actions (Login/Register vs Dashboard/Logout)
- Mobile hamburger menu with slide-in panel

**Hero**
- Animated paw charm (CSS keyframe sway animation)
- Location badge with pulse dot indicator
- Large headline with italic accent text
- Two CTA buttons: "Book a pickup" and "See how it works"
- Tag pills for service types
- Animated SVG pulse line (stroke-dashoffset draw animation)
- Hero image with floating secondary image and stats badge

**Services**
- 4-column grid of service cards
- Each card: photo, number, icon, title, description, tags
- Hover state: background elevation change

**Process**
- 5-step vertical timeline
- Each row: italic number, title, description, step-specific tag
- Border-separated list items

**Fleet**
- Horizontal band with 4 info columns
- Categories: Vehicles, Safety & Care, Documentation, Support
- Monospace typography for list items

**Philosophy**
- Two-column grid: photo + blockquote
- Serif italic quote with lime accent
- Monospace citation

**Transports**
- 2-column grid of recent trip cards
- Each card: category label, arrow icon, title, description
- Hover: arrow rotates 45° and turns lime

**BookingForm**
- Full booking form with fields:
  - Pet Category (select)
  - Preferred Date (date input)
  - Email, Name
  - Pickup/Drop-off locations
  - Preferred Time (select)
  - Pet Name, Additional Notes (textarea)
- On submit: saves to backend via API + opens pre-filled mailto link
- Confirmation message with fallback link

### Styling Approach
- **Tailwind CSS v4** for layout and utilities
- Custom CSS variables for brand colors (--lime, --jade, --ink, etc.)
- Interstitial `<style>` tags in components for complex animations and media queries
- Google Fonts: Fraunces (headings), IBM Plex Sans (body), IBM Plex Mono (labels/UI)
- Responsive breakpoints: 960px, 900px, 720px, 640px, 400px
- Scroll-reveal animations via CSS opacity/transform transitions

---

## State Management

### Zustand Stores

**authStore** (`frontend/src/stores/authStore.js`)
```
State:
  - user: null | { id, name, email }
  - token: string | null (from localStorage)
  - loading: boolean

Actions:
  - login(email, password) → stores token + user
  - register(name, email, password) → stores token + user
  - logout() → clears token + user
  - fetchProfile() → refreshes user from /api/auth/profile
```

**bookingStore** (`frontend/src/stores/bookingStore.js`)
```
State:
  - currentBooking: null | booking object
  - bookings: booking[]

Actions:
  - setBooking(booking) → sets current booking
  - clearBooking() → resets current booking
  - setBookings(bookings) → sets bookings array
```

### Data Flow
```
User Action → Component → Zustand Action → API Service → Backend API → Supabase DB
                                                         ↓
User ← Component Update ← Zustand State ← API Response ←┘
```

---

## API Integration Layer

### Axios Instance (`frontend/src/services/api.js`)
- Base URL from `VITE_API_URL` env variable (defaults to `/api` for Vite proxy)
- Request interceptor: attaches `Authorization: Bearer <token>` header
- Response interceptor: handles 401 errors by clearing token and redirecting to `/login`

### API Services
| Service | Methods | Endpoints |
|---------|---------|-----------|
| authService | login, register, getProfile | `/auth/login`, `/auth/register`, `/auth/profile` |
| bookingService | createBooking, getBookings, getBooking, updateBooking, deleteBooking | `/bookings` CRUD |
| transportService | getServices, getService | `/services`, `/services/:id` |

### Vite Proxy Configuration
```
'/api' → http://localhost:5000
```
Development proxy avoids CORS issues during local development.

---

## Authentication & Authorization

### Flow
```
┌──────────┐     POST /api/auth/login     ┌──────────┐
│  Client   │ ──────────────────────────→ │  Server   │
│ (React)  │ ←────── JWT token ───────── │ (Express) │
└──────────┘                              └──────────┘
     │                                          │
     │  Authorization: Bearer <token>           │
     │ ────────────────────────────────────────→│
     │                                          │ verify(token)
     │ ←────── 200 with data ─────────────────│
```

### Token Structure
```
Header: { alg: "HS256", typ: "JWT" }
Payload: {
  id: "user-uuid",
  email: "user@email.com",
  name: "User Name",
  iat: timestamp,
  exp: timestamp + 7 days
}
Signature: HMAC-SHA256(header.payload, JWT_SECRET)
```

### Password Security
- Bcrypt hashing with 10 salt rounds
- Passwords never stored in plain text
- Login compares bcrypt hash, not plain text

---

## Deployment & Configuration

### Environment Variables

**Backend (.env)**
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 5000 | Server port |
| NODE_ENV | No | development | Environment mode |
| CLIENT_URL | No | http://localhost:3000 | Frontend origin for CORS |
| SUPABASE_URL | Yes | - | Supabase project URL |
| SUPABASE_SERVICE_KEY | Yes | - | Supabase service role key |
| JWT_SECRET | Yes | - | JWT signing secret |

**Frontend (.env)**
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| VITE_API_URL | No | /api | Backend API base URL |
| VITE_SUPABASE_URL | Yes | - | Supabase project URL |
| VITE_SUPABASE_ANON_KEY | Yes | - | Supabase anonymous key |

### Running the Application

**Backend:**
```bash
cd backend
npm install
cp .env.example .env   # Edit with your Supabase credentials
npm run dev            # Starts on port 5000 with watch mode
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env   # Edit with your Supabase credentials
npm run dev            # Starts on port 3000 with HMR
```

**Database Setup:**
1. Create a Supabase project
2. Open SQL Editor in Supabase Dashboard
3. Run the contents of `database/schema.sql`
4. Copy your Supabase URL and keys to `.env` files

### Production Build
```bash
# Frontend
cd frontend && npm run build   # Outputs to dist/

# Backend
cd backend && npm start        # Runs without watch mode
```

---

## Project Structure

```
pawport-transport/
│
├── frontend/                          # React + Vite Frontend
│   ├── index.html                    # HTML entry point with Google Fonts
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite config with API proxy
│   ├── .env.example                  # Environment template
│   ├── public/
│   │   └── images/                   # Static images (hero, services, etc.)
│   │       ├── hero-dog-window.jpg
│   │       ├── hero-roadtrip.jpg
│   │       ├── philosophy-reunion.jpg
│   │       ├── service-flight.jpg
│   │       ├── service-ground.jpg
│   │       ├── service-relocation.jpg
│   │       └── service-taxi.jpg
│   └── src/
│       ├── main.jsx                  # React entry point with BrowserRouter
│       ├── App.jsx                   # Root component with route definitions
│       ├── index.css                 # Global styles, CSS variables, base styles
│       │
│       ├── components/               # Reusable UI components
│       │   ├── Header.jsx            # Fixed navigation header
│       │   ├── Footer.jsx            # Site footer with links
│       │   ├── Hero.jsx              # Hero section with animations
│       │   ├── Services.jsx          # Services grid (4 cards)
│       │   ├── Process.jsx           # 5-step process timeline
│       │   ├── Fleet.jsx             # Fleet & safety info band
│       │   ├── Philosophy.jsx        # Quote + photo section
│       │   ├── Transports.jsx        # Recent trips grid
│       │   └── BookingForm.jsx       # Booking form with email integration
│       │
│       ├── pages/                    # Page-level components
│       │   ├── HomePage.jsx          # Landing page (all sections)
│       │   ├── BookingPage.jsx       # Standalone booking page
│       │   ├── LoginPage.jsx         # User login form
│       │   ├── RegisterPage.jsx      # User registration form
│       │   └── DashboardPage.jsx     # User dashboard with bookings
│       │
│       ├── stores/                   # Zustand state management
│       │   ├── authStore.js          # Authentication state
│       │   └── bookingStore.js       # Booking state
│       │
│       └── services/                 # API integration layer
│           ├── api.js                # Axios instance + API services
│           └── supabase.js           # Supabase client
│
├── backend/                          # Node.js + Express Backend
│   ├── server.js                     # Express server entry point
│   ├── package.json                  # Backend dependencies
│   ├── .env.example                  # Environment template
│   │
│   ├── config/
│   │   └── database.js               # Supabase client initialization
│   │
│   ├── middleware/
│   │   └── auth.js                   # JWT authentication middleware
│   │
│   └── routes/
│       ├── auth.js                   # Auth routes (login, register, profile)
│       ├── bookings.js               # Booking CRUD routes
│       └── services.js               # Transport services routes
│
├── database/
│   └── schema.sql                    # PostgreSQL schema, RLS policies, seed data
│
├── pawport-transport-ashan.html      # Original static HTML reference
├── download-images.sh                # Image download script
└── ARCHITECTURE.md                   # This documentation file
```

---

## Key Design Decisions

1. **Zustand over Redux**: Chosen for its minimal boilerplate and React-friendly API. The app has relatively simple state (auth + bookings), making Zustand's lightweight approach ideal.

2. **Supabase over raw PostgreSQL**: Provides managed PostgreSQL with built-in auth, real-time subscriptions, and RLS — reducing backend complexity.

3. **Express.js backend**: Acts as an intermediary API layer for business logic validation before database operations. JWT auth is handled server-side for security.

4. **Tailwind CSS + CSS Variables**: Tailwind for rapid layout, custom CSS variables for the brand design system (colors, fonts, spacing). Complex animations use scoped `<style>` tags.

5. **Vite proxy for development**: The Vite dev server proxies `/api` requests to the Express backend, eliminating CORS issues during development while maintaining separate deployments.

6. **Component-scoped styles**: Complex animations and responsive rules that exceed Tailwind's utility classes use component-level `<style>` tags for co-location and maintainability.

7. **Email-based booking flow**: Booking form composes a `mailto:` link while also persisting to the backend, providing both immediate email notification and database record.