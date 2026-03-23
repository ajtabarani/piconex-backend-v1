import { PersonId, Role } from "../../../domain";
import {
  PersonAuthorizationSnapshot,
  PersonPolicy,
  PolicyGuard,
} from "../../policies";
import { PersonReadRepository } from "../readModel";

export interface CheckPersonHasRoleRequest {
  actor: PersonAuthorizationSnapshot;
  personId: PersonId;
  role: Role;
}

export class CheckPersonHasRole {
  constructor(
    private readonly repository: PersonReadRepository,
    private readonly policy: PersonPolicy,
    private readonly guard: PolicyGuard,
  ) {}

  async execute(request: CheckPersonHasRoleRequest): Promise<boolean> {
    const target = await this.repository.findAuthorizationSnapshot(
      request.personId,
    );

    if (!target) return false;

    this.guard.ensure(this.policy.canViewPerson(request.actor, target));

    return target.activeRoles.some((r) => r === request.role);
  }
}
