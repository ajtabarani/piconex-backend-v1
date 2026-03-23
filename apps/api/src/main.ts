import { createPool } from "mysql2/promise";
import { bootstrapIAM } from "./bootstrap/bootstrapIAM";
import { Role, UniversityId, PersonId } from "@piconex/iam/composition";

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

  const personDTO = await iam.queries.getPersonById.execute({
    actor: {
      personId: PersonId.create("2"),
      universityId: UniversityId.create("1jdhx3b35"),
      isActive: true,
      isSuperAdmin: false,
      activeRoles: [Role.Admin],
    },
    personId: PersonId.create("2"),
  });

  console.log(personDTO);
}

main().catch((err) => {
  if (err instanceof Error) console.error(err.message);
  else console.log(err);
});
