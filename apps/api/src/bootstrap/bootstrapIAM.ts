import { Pool } from "mysql2/promise";
import {
  PersonPolicy,
  PolicyGuard,
  GetPersonAuthorizationSnapshot,
  CheckPersonHasRole,
  CheckPersonIsActive,
  UpdateContactInformation,
  AuthorizationServiceImpl,
  PersonRepositoryImpl,
  PersonReadRepositoryImpl,
} from "@piconex/iam/composition";

export function bootstrapIAM(pool: Pool) {
  // ───────────────
  // infrastructure
  // ───────────────
  const personRepository = new PersonRepositoryImpl(pool);
  const personReadRepository = new PersonReadRepositoryImpl(pool);

  // ───────────────
  // policies / guards
  // ───────────────
  const personPolicy = new PersonPolicy();
  const policyGuard = new PolicyGuard();

  // ───────────────
  // queries
  // ───────────────
  const getAuthorizationSnapshot = new GetPersonAuthorizationSnapshot(
    personReadRepository,
    personPolicy,
    policyGuard,
  );

  const checkPersonHasRole = new CheckPersonHasRole(
    personReadRepository,
    personPolicy,
    policyGuard,
  );

  const checkPersonIsActive = new CheckPersonIsActive(
    personReadRepository,
    personPolicy,
    policyGuard,
  );

  // ───────────────
  // requests (use cases)
  // ───────────────
  const updateContactInformation = new UpdateContactInformation(
    personRepository,
    personPolicy,
    policyGuard,
  );

  // ───────────────
  // services (facade)
  // ───────────────
  const authorizationService = new AuthorizationServiceImpl(
    checkPersonHasRole,
    checkPersonIsActive,
    getAuthorizationSnapshot,
  );

  return {
    getAuthorizationSnapshot,
    // expose use cases if needed
    updateContactInformation,

    // expose services (what other contexts use)
    authorizationService,
  };
}
