# Project Knowledge — Event Booking System

Read this fully before the interview. This document explains everything about how this project works so you can talk about it confidently.

---

## What is this project?

This is a full-stack web application where users can:

- Browse a list of upcoming events
- Log in to their account
- Book seats for any event
- View their booking history

It is built with **React** on the frontend, **Node.js + Express** on the backend, and **MongoDB** as the database.

---

## How the two parts connect

The project has two completely separate applications:

```text
Frontend (React)  →  talks to  →  Backend (Express API)  →  talks to  →  MongoDB
Port 5174                          Port 5001
```

The frontend never touches the database directly. It only sends HTTP requests to the backend. The backend talks to MongoDB and sends the response back. This separation is called a **client-server architecture**.

---

## Complete Flow — What happens when a user uses the app

### Step 1 — User opens the app

The React app loads in the browser. It immediately calls `GET /api/events` to fetch all events from the backend. The backend reads them from MongoDB and returns them. The frontend displays them as cards on the screen.

No login is required to see events.

---

### Step 2 — User logs in

User clicks a demo credential → email and password fill automatically → clicks Sign In.

**What happens behind the scenes:**

1. Frontend sends `POST /api/auth/login` with `{ email, password }` to the backend
2. Backend searches MongoDB for a user with that email
3. Backend runs `bcrypt.compare(passwordEntered, passwordStoredInDB)`
   - The password in the database is **never stored as plain text** — it is stored as a hash (an encrypted version)
   - bcrypt hashes the entered password the same way and checks if they match
4. If they match → backend creates a **JWT token** and sends it back
5. Frontend saves this token in `localStorage` (browser storage)
6. The user's name appears in the Navbar — they are now logged in

From this point, every API request the frontend makes will carry this token in the request header.

---

### Step 3 — How JWT works (important to understand)

JWT stands for **JSON Web Token**. Think of it like a **digital ID card**.

When you log into a government office and get an ID card:

- You show that ID card whenever you need to access something
- The security guard just checks the ID card — they don't call the government office every time
- The ID card has an expiry date

JWT works the same way:

- After login, the backend creates a token: `jwt.sign({ userId: "abc123" }, SECRET_KEY, { expiresIn: "7d" })`
- This token is a long string like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- It has 3 parts separated by dots: **Header . Payload . Signature**
  - **Header** — says what algorithm was used
  - **Payload** — contains the data (userId in our case)
  - **Signature** — a secret stamp that proves it was not tampered with
- Frontend stores this token and sends it with every request: `Authorization: Bearer <token>`
- Backend receives it, runs `jwt.verify(token, SECRET_KEY)` — if valid, it knows who the user is
- No database lookup needed to check who is logged in — the token itself carries that information

This is why JWT is better than traditional sessions:

- **Sessions** store user data on the server — every request needs a DB lookup
- **JWT** is stateless — the server just checks the signature, nothing stored on server side

---

### Step 4 — User clicks on an event

Frontend calls `GET /api/events/:id` with the event's ID. Backend fetches that specific event and returns it with `availableSeats` computed as `totalSeats - bookedSeats`.

The detail page shows the event info, a seat availability bar, and a booking form.

---

### Step 5 — User books seats (the critical part)

User enters number of seats → clicks Book.

**What happens:**

1. Frontend sends `POST /api/bookings` with `{ eventId, seats: 2 }`
2. The request carries the JWT token — backend's `authMiddleware` verifies it and extracts `userId`
3. Backend checks: `event.totalSeats - event.bookedSeats >= requestedSeats`
   - If not enough seats → returns an error → frontend shows a toast notification
4. If seats are available → backend does two things:
   - Creates a new Booking document in MongoDB: `{ user: userId, event: eventId, seats: 2 }`
   - Updates the event's booked count: `Event.findByIdAndUpdate(id, { $inc: { bookedSeats: 2 } })`
5. Frontend shows a success message

**Why `$inc` and not a regular update?**

`$inc` is a MongoDB atomic operation. Imagine two users booking the last 2 seats at the exact same millisecond. With a regular update (read the value, add to it, write back), both might read `0 booked seats` and both succeed — creating overbooking. With `$inc`, MongoDB handles the addition internally in one locked step, so this race condition cannot happen.

---

### Step 6 — User views their bookings

Frontend calls `GET /api/bookings/my` with the JWT token. Backend extracts `userId` from the token, finds all bookings where `user === userId`, and uses `.populate('event')` to also return the full event details (name, date, location) alongside each booking.

`.populate()` in Mongoose works like a SQL JOIN — the booking only stores the event's ID, but populate replaces that ID with the full event object automatically.

---

## How the frontend manages auth state (React Context)

When the user logs in, the token and user info are stored in `AuthContext` — a global React state available to every component.

- **Navbar** reads from AuthContext → shows username and Logout button if logged in
- **ProtectedRoute** reads from AuthContext → if no token, redirects to `/login`
- **Logout** clears the token from AuthContext and localStorage

Without Context, you'd pass user data as props through every component. Context gives one shared place that every component can read from directly.

---

## How the Axios interceptor works

Instead of writing `headers: { Authorization: token }` in every API call, we configure it once:

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

Every request made through our `api` instance automatically gets the token attached. One place, zero repetition.

---

## Database Models

**User** — stores who can log in

```text
name, email (must be unique), password (bcrypt hashed), timestamps
```

**Event** — stores event information

```text
name, description, date, location, totalSeats, bookedSeats (starts at 0), timestamps
```

**Booking** — records who booked what

```text
user → points to a User, event → points to an Event, seats (number), timestamps
```

Note: `availableSeats` is NOT stored. It is always calculated as `totalSeats - bookedSeats` when needed. Storing it separately would mean two fields to update on every booking — they could get out of sync. One calculation is always accurate.

---

## API Endpoints at a glance

| Method | URL | Login required | What it does |
| ------ | --- | -------------- | ------------ |
| POST | `/api/auth/login` | No | Verifies credentials, returns JWT |
| GET | `/api/events` | No | Returns all events |
| GET | `/api/events/:id` | No | Returns one event |
| POST | `/api/bookings` | Yes | Creates a booking |
| GET | `/api/bookings/my` | Yes | Returns current user's bookings |

---

## Tech decisions worth knowing

**Why MongoDB?**
Schema-flexible, easy to scale, great with Node.js via Mongoose. Events and bookings have varying data that fits a document model well.

**Why Express?**
Minimal and un-opinionated. You wire exactly what you need — routes, middleware, error handling. No magic.

**Why React + Vite?**
Vite is much faster than Create React App. It serves files using native ES Modules in the browser — no bundling step during development, so hot reload is instant.

**Why Tailwind CSS?**
Write styles directly in JSX using utility classes. No context switching between CSS files and components. Tailwind v4 uses a Vite plugin — no config file needed.

---

## What I would add with more time

- **Cancel booking** — decrement `bookedSeats` when user cancels
- **Admin panel** — create and manage events
- **Register page** — currently users are only added through the seed script
- **Email confirmation** — send a booking receipt via email
- **Pagination** — load events in pages instead of all at once
- **Input validation** — Zod or Joi on the backend for stricter request validation
