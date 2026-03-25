import cors from "cors";
import express from "express";
import { createPool } from "mysql2/promise";
import { bootstrapIAM } from "./bootstrap/bootstrapIAM";
import { registerRoutes } from "./http/routes";
import { checkJwt } from "./http/middleware/checkJwt";
import { authMiddleware } from "./http/middleware/auth";

async function main() {
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
  const auth = authMiddleware(iam);

  const app = express();
  app.use(
    cors({
      origin: "http://localhost:5173",
    }),
  );
  app.use(express.json());
  app.use(checkJwt);
  app.use(auth);

  // 4. Register routes (pass deps)
  registerRoutes(app, {
    iam,
  });

  // 5. Start server
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

main().catch((err) => {
  if (err instanceof Error) console.error(err);
  else console.log(err);
});
