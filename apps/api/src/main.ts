import { createPool } from "mysql2";
import { bootstrapIAM } from "./bootstrap/bootstrapIAM";

async function main() {
  const pool = createPool({
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "piconex",
  });

  const iam = bootstrapIAM(pool);

  // Example usage
  console.log("IAM context bootstrapped:", iam);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
