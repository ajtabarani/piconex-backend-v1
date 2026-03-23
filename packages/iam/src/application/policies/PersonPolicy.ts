import { PersonAuthorizationSnapshot } from ".";
import { PersonId, Role } from "../../domain";

export class PersonPolicy {
  // ===== Authority Checks =====

  isSelf(actor: PersonAuthorizationSnapshot, targetId: PersonId): boolean {
    return actor.personId.equals(targetId);
  }

  isAdmin(actor: PersonAuthorizationSnapshot): boolean {
    return this.hasActiveRole(actor, Role.Admin);
  }

  isSuperAdmin(actor: PersonAuthorizationSnapshot): boolean {
    return actor.isSuperAdmin;
  }

  // ===== Core IAM Permission =====

  /**
   * Is actor admin or above?
   */
  hasAdministrativeAuthority(actor: PersonAuthorizationSnapshot): boolean {
    return this.isSuperAdmin(actor) || this.isAdmin(actor);
  }

  /**
   * Can they manage their own information?
   */
  canManageOwnIdentity(
    actor: PersonAuthorizationSnapshot,
    targetId: PersonId,
  ): boolean {
    return this.isSelf(actor, targetId) || this.isSuperAdmin(actor);
  }

  /**
   * Can actor manage (modify/activate/deactivate) the target?
   * Enforces strict hierarchy:
   * SuperAdmin > Admin > Everyone else
   */
  canManagePerson(
    actor: PersonAuthorizationSnapshot,
    target: PersonAuthorizationSnapshot,
  ): boolean {
    const actorRank = this.getHighestRank(actor);
    const targetRank = this.getHighestRank(target);

    return actorRank > targetRank;
  }

  /**
   * Can actor view the target?
   * - Self always allowed
   * - Otherwise follow hierarchy
   */
  canViewPerson(
    actor: PersonAuthorizationSnapshot,
    target: PersonAuthorizationSnapshot,
  ): boolean {
    if (this.isSelf(actor, target.personId)) return true;

    return this.canManagePerson(actor, target);
  }

  private hasActiveRole(actor: PersonAuthorizationSnapshot, role: Role) {
    return actor.activeRoles.some((r) => r === role);
  }

  private getHighestRank(snapshot: PersonAuthorizationSnapshot): number {
    if (snapshot.isSuperAdmin) return 3;

    if (this.hasActiveRole(snapshot, Role.Admin)) return 2;

    if (
      this.hasActiveRole(snapshot, Role.Student) ||
      this.hasActiveRole(snapshot, Role.Faculty)
    ) {
      return 1;
    }

    return 0;
  }
}
