# websocket
React frontend
REST for auth + CRUD
WebSockets for realtime
Postgres or SQLite for DB
Prisma for ORM
Splunk for logs


src/
├─ server.ts        ← bootstraps everything
├─ http/
│   ├─ app.ts       ← Express/Fastify app
│   ├─ routes/
│   └─ controllers/
├─ ws/
│   ├─ index.ts     ← WebSocket server setup
│   ├─ connection.ts
│   ├─ handlers/
│   │   ├─ message.ts
│   │   ├─ room.ts
│   │   └─ presence.ts
│   └─ state.ts     ← in-memory maps (users, rooms)
├─ db/
│   └─ prisma.ts
