import { Pool } from "mysql2";
import { PersonRepositoryImpl, AuthorizationServiceImpl } from "@piconex/iam";

export function bootstrapIAM(pool: Pool) {
  const personRepository = new PersonRepositoryImpl(pool);

  const authorizationService = new AuthorizationServiceImpl(personRepository);

  return {
    personRepository,
    authorizationService,
  };
}
