import {
  AuthProvider,
  ExternalAuthId,
  PersonId,
  PersonRepository,
} from "../../../domain";
import {
  PersonAuthorizationSnapshot,
  PersonPolicy,
  PolicyGuard,
} from "../../policies";

export interface UnlinkExternalAuthAccountRequest {
  actor: PersonAuthorizationSnapshot;
  personId: PersonId;
  authProvider: AuthProvider;
  externalAuthId: ExternalAuthId;
}

export class UnlinkExternalAuthAccount {
  constructor(
    private readonly repository: PersonRepository,
    private readonly policy: PersonPolicy,
    private readonly guard: PolicyGuard,
  ) {}

  async execute(request: UnlinkExternalAuthAccountRequest): Promise<void> {
    this.guard.ensure(this.policy.isSuperAdmin(request.actor));

    const person = await this.repository.load(request.personId);

    person.unlinkExternalAuthAccount(
      request.authProvider,
      request.externalAuthId,
    );

    await this.repository.save(person);
  }
}
