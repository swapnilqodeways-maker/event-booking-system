# Interview Knowledge — Event Booking System

---

## 1. Give me a quick overview of this project.

This is a full-stack Event Booking System where users can browse events, log in, and book seats.

- **Frontend** — React + Vite app, Tailwind CSS for styling, React Router for navigation
- **Backend** — Node.js + Express REST API, MongoDB Atlas as the database
- **Auth** — JWT-based login, bcrypt for password hashing

Users can see all upcoming events, click on one to view details, book seats, and see their booking history.

---

## 2. What is the folder structure?

```
EB/
├── frontend/          React app (port 5174)
│   └── src/
│       ├── api/       Axios instance
│       ├── components/ Navbar, EventCard, Spinner, Toast
│       ├── context/   AuthContext (global auth state)
│       └── pages/     Login, EventList, EventDetail, BookingHistory
│
└── backend/           Express API (port 5001)
    └── src/
        ├── models/    User, Event, Booking (Mongoose schemas)
        ├── controllers/ auth, events, bookings logic
        ├── middleware/ auth check, error handler
        ├── routes/    API route definitions
        └── seed/      Script to populate initial data
```

---

## 3. How does login and authentication work?

**Step by step:**

1. User enters email and password → frontend sends `POST /api/auth/login`
2. Backend finds the user in MongoDB by email
3. Runs `bcrypt.compare(enteredPassword, storedHashedPassword)`
4. If match → signs a JWT: `jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })`
5. Returns the token to the frontend
6. Frontend stores token in `localStorage` and saves user info in `AuthContext`
7. Every future request attaches the token: `Authorization: Bearer <token>`
8. Backend middleware (`authMiddleware`) verifies the token on protected routes using `jwt.verify()`

---

## 4. What is JWT and why use it instead of sessions?

**JWT (JSON Web Token)** is a self-contained token that carries user information encoded inside it.

- **Sessions** store user data on the server — requires memory or a database lookup on every request
- **JWT** is stateless — the server just verifies the signature, no DB lookup needed
- Scales easily because any server instance can verify the token without shared state
- Suitable for this project since we don't need to revoke tokens in real-time

---

## 5. Why hash passwords with bcrypt?

You never store plain-text passwords. If the database leaks, passwords are safe.

- `bcrypt.hash("password123", 10)` — the `10` is the salt rounds (cost factor)
- Higher cost = slower hashing = harder to brute-force
- `bcrypt.compare()` hashes the entered password the same way and compares — never decrypts

---

## 6. How does the booking work? How do you prevent overbooking?

This is the key logic:

1. User requests N seats → `POST /api/bookings` with `{ eventId, seats }`
2. Backend checks: `event.totalSeats - event.bookedSeats >= requestedSeats`
3. If not enough seats → returns 400 error
4. If seats available → creates the Booking document, then does:

```js
Event.findByIdAndUpdate(eventId, { $inc: { bookedSeats: seats } })
```

**Why `$inc`?** It is a MongoDB atomic operation. Even if two users book at the exact same moment, MongoDB processes `$inc` one at a time — so seats can never go negative. This prevents the race condition that a simple read-then-write would have.

---

## 7. Why is `availableSeats` not stored in the database?

Only `totalSeats` and `bookedSeats` are stored. `availableSeats` is computed:

```js
availableSeats = totalSeats - bookedSeats
```

This keeps a **single source of truth**. If we stored `availableSeats` separately, we'd have to update two fields on every booking, and they could get out of sync. Deriving it avoids that problem entirely.

---

## 8. What is the Axios interceptor doing?

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

Instead of manually attaching the token in every API call, the interceptor runs automatically before every request. One place to manage auth headers for the entire app.

---

## 9. What is React Context and why use it here?

`AuthContext` holds the logged-in user state globally so any component can access it — the Navbar shows the username, protected routes check if a user exists, the logout button clears it.

Without Context, you'd have to pass user data as props through every component (prop drilling). Context solves this cleanly for app-wide state like auth.

---

## 10. How does the protected route work?

```jsx
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  return children;
};
```

If a user tries to visit `/bookings` without being logged in, they are immediately redirected to `/login`.

---

## 11. What are the API endpoints?

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/events` | No | List all events |
| GET | `/api/events/:id` | No | Single event details |
| POST | `/api/bookings` | Yes | Book seats for an event |
| GET | `/api/bookings/my` | Yes | Current user's bookings |

---

## 12. What are the database models?

**User**
```
name, email (unique), password (hashed), timestamps
```

**Event**
```
name, description, date, location, totalSeats, bookedSeats (default 0), timestamps
```

**Booking**
```
user (reference to User), event (reference to Event), seats, timestamps
```

The Booking model uses references (foreign keys). When fetching bookings, Mongoose's `.populate('event')` joins the event data automatically.

---

## 13. What is `.populate()` in Mongoose?

When a Booking is stored, it only saves the event's `_id` as a reference. When fetching a user's bookings, we call:

```js
Booking.find({ user: userId }).populate('event')
```

Mongoose replaces the `event` field (which was just an ID) with the full event document. Similar to a SQL JOIN.

---

## 14. What is the seed script?

A one-time script (`npm run seed`) that:
1. Clears all existing Users, Events, and Bookings from the database
2. Inserts 2 demo users with hashed passwords
3. Inserts 5 events with Indian locations

Used to set up a fresh, consistent state for development or demo purposes.

---

## 15. Why Vite instead of Create React App?

Vite is significantly faster — it uses native ES Modules in the browser during development so there is no bundling step. Hot reload is near-instant. Create React App is slower and largely outdated.

---

## 16. How does Tailwind CSS work here?

Tailwind v4 is used with the `@tailwindcss/vite` plugin. Instead of writing custom CSS classes, you compose utility classes directly in JSX (`text-sm`, `font-semibold`, `px-4`, etc.).

Reusable component classes like `.card`, `.btn-primary`, `.chip` are defined once using `@layer components` in `index.css` and used throughout the app.

---

## 17. What would you improve if given more time?

- **Cancel booking** — let users cancel a booking (decrement `bookedSeats` back)
- **Admin panel** — create/edit/delete events
- **Pagination** — for large numbers of events
- **Refresh token** — currently JWT expires in 7 days with no refresh mechanism
- **Email confirmation** — send booking confirmation email
- **Input validation** — use a library like Zod or Joi on the backend for stronger validation
