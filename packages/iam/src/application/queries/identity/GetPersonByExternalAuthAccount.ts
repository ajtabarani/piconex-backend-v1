import { AuthProvider, ExternalAuthId } from "../../../domain";
import {
  PersonAuthorizationSnapshot,
  PersonPolicy,
  PolicyGuard,
} from "../../policies";
import { PersonReadRepository, PersonDTO } from "../readModel";

export interface GetPersonByExternalAuthAccountRequest {
  actor: PersonAuthorizationSnapshot;
  provider: AuthProvider;
  externalAuthId: ExternalAuthId;
}

export class GetPersonByExternalAuthAccount {
  constructor(
    private readonly repository: PersonReadRepository,
    private readonly policy: PersonPolicy,
    private readonly guard: PolicyGuard,
  ) {}

  async execute(
    request: GetPersonByExternalAuthAccountRequest,
  ): Promise<PersonDTO | null> {
    this.guard.ensure(this.policy.hasAdministrativeAuthority(request.actor));

    return this.repository.findByExternalAuthAccount(
      request.provider,
      request.externalAuthId,
    );
  }
}
