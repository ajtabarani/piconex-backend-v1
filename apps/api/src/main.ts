import { createPool } from "mysql2/promise";
import { bootstrapIAM } from "./bootstrap/bootstrapIAM";
import {
  Role,
  UniversityId,
  PersonId,
  ExternalAuthId,
  Address,
} from "@piconex/iam/composition";

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

  // const personDTO = await iam.queries.getPersonById.execute({
  //   actor: {
  //     personId: PersonId.create("2"),
  //     universityId: UniversityId.create("1jdhx3b35"),
  //     isActive: true,
  //     isSuperAdmin: false,
  //     activeRoles: [Role.Admin],
  //   },
  //   personId: PersonId.create("2"),
  // });

  const result = await iam.requests.createAdmin.execute({
    actor: {
      personId: PersonId.create("1"),
      universityId: UniversityId.create("1jdhx3b35"),
      isActive: true,
      isSuperAdmin: true,
      activeRoles: [Role.Admin],
    },
    personId: PersonId.create("admin-uuid-123"),

    authProvider: "google",
    externalAuthId: ExternalAuthId.create("google-oauth-id-abc123"),

    universityId: UniversityId.create("university-123"),

    firstName: "John",
    preferredName: "Johnny",
    middleName: null,
    lastName: "Doe",

    email: "john.doe@university.edu",
    phoneNumber: "610-555-1234",

    pronouns: "he/him",
    sex: "Male",
    gender: "Male",
    birthday: new Date("1995-06-15"),

    address: new Address(
      "123 Main St",
      null,
      "Allentown",
      "PA",
      "18104",
      "USA",
    ),

    jobTitle: "Accessibility Coordinator",
    department: "Disability Services",
    specialization: "Student Accommodations",
  });

  console.log(result);
}

main().catch((err) => {
  if (err instanceof Error) console.error(err);
  else console.log(err);
});
