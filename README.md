# websocket
React frontend
REST for auth + CRUD
WebSockets for realtime
Postgres or SQLite for DB
Prisma for ORM
Splunk for logs


backend/
  src/
    server.ts
    routes/
      auth.routes.ts
      messages.routes.ts
    controllers/
      auth.controller.ts
      messages.controller.ts
    services/
      auth.service.ts
      messages.service.ts
    websocket/
      index.ts
      message.gateway.ts
    libs/
      eventBus.ts
      logger.ts
    db/
      prisma.ts