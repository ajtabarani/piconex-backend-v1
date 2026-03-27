import cors from "cors";
import express from "express";
import { createPool } from "mysql2/promise";
import { bootstrapIAM } from "./bootstrap";
import { registerIAMRoutes, checkJwt, authMiddleware, errorHandler } from "./http";

async function main() {
  // Bootstrapping
  const pool = createPool({
    host: "178.156.189.138",
    user: "piconex",
    password: "pjaplmTabs7!",
    database: "piconexdb_v1",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  const iam = bootstrapIAM(pool);

  // Routing
  const app = express();

  /// Middleware
  app.use(express.json());
  app.use(
    cors({
      origin: "http://localhost:5173",
    }),
  );
  app.use(checkJwt);
  app.use(authMiddleware(iam));

  /// Registering routes
  registerIAMRoutes(app, iam);
  
  // Error handling
  app.use(errorHandler);

  /// Starting server
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

main().catch((err) => {
  if (err instanceof Error) console.error(err);
  else console.log(err);
});
