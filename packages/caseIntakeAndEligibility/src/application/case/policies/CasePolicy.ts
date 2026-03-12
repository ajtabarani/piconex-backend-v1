import {
  PersonAuthorizationSnapshot,
  AuthorizationService,
  Role,
} from "@piconex/iam";
import { Case } from "../../../domain";

export class CasePolicy {
  constructor(private readonly auth: AuthorizationService) {}

  // ===== Basic Role Checks =====

  isSuperAdmin(actor: PersonAuthorizationSnapshot): boolean {
    return actor.isSuperAdmin;
  }

  async isAdmin(actor: PersonAuthorizationSnapshot): Promise<boolean> {
    return this.auth.hasRole(actor, actor.personId, Role.Admin);
  }

  async isStudent(actor: PersonAuthorizationSnapshot): Promise<boolean> {
    return this.auth.hasRole(actor, actor.personId, Role.Student);
  }

  // ===== Case Relationship Checks =====

  isCaseOwner(actor: PersonAuthorizationSnapshot, caseEntity: Case): boolean {
    return actor.personId.equals(caseEntity.getStudentId());
  }

  isAssignedAdmin(
    actor: PersonAuthorizationSnapshot,
    caseEntity: Case,
  ): boolean {
    return caseEntity.isAssignedAdmin(actor.personId);
  }

  isPrimaryAdmin(
    actor: PersonAuthorizationSnapshot,
    caseEntity: Case,
  ): boolean {
    return caseEntity.isPrimaryAdmin(actor.personId);
  }

  // ===== Composite Policies =====

  canSkipIntake(actor: PersonAuthorizationSnapshot, caseEntity: Case): boolean {
    return this.isPrimaryAdmin(actor, caseEntity) || this.isSuperAdmin(actor);
  }

  canApproveIntake(
    actor: PersonAuthorizationSnapshot,
    caseEntity: Case,
  ): boolean {
    return this.isPrimaryAdmin(actor, caseEntity) || this.isSuperAdmin(actor);
  }

  canDenyIntake(actor: PersonAuthorizationSnapshot, caseEntity: Case): boolean {
    return this.isPrimaryAdmin(actor, caseEntity) || this.isSuperAdmin(actor);
  }

  canCancelCase(actor: PersonAuthorizationSnapshot, caseEntity: Case): boolean {
    return this.isPrimaryAdmin(actor, caseEntity) || this.isSuperAdmin(actor);
  }

  canReopenCase(actor: PersonAuthorizationSnapshot, caseEntity: Case): boolean {
    return this.isPrimaryAdmin(actor, caseEntity) || this.isSuperAdmin(actor);
  }

  canAddCaseNote(
    actor: PersonAuthorizationSnapshot,
    caseEntity: Case,
  ): boolean {
    return this.isAssignedAdmin(actor, caseEntity);
  }

  canModifyDisabilities(
    actor: PersonAuthorizationSnapshot,
    caseEntity: Case,
  ): boolean {
    return this.isAssignedAdmin(actor, caseEntity);
  }

  canModifyFlags(
    actor: PersonAuthorizationSnapshot,
    caseEntity: Case,
  ): boolean {
    return this.isAssignedAdmin(actor, caseEntity);
  }

  canUnassignAdmin(
    actor: PersonAuthorizationSnapshot,
    caseEntity: Case,
  ): boolean {
    return this.isPrimaryAdmin(actor, caseEntity) || this.isSuperAdmin(actor);
  }

  canTransferPrimaryAdmin(
    actor: PersonAuthorizationSnapshot,
    caseEntity: Case,
  ): boolean {
    return this.isPrimaryAdmin(actor, caseEntity) || this.isSuperAdmin(actor);
  }

  canWithdrawIntake(
    actor: PersonAuthorizationSnapshot,
    caseEntity: Case,
  ): boolean {
    return this.isCaseOwner(actor, caseEntity);
  }

  // ===== Special Case =====

  async canAssignAdminToCase(
    actor: PersonAuthorizationSnapshot,
    caseEntity: Case,
  ): Promise<boolean> {
    if (this.isSuperAdmin(actor)) return true;

    const isAdmin = await this.isAdmin(actor);

    if (!isAdmin) return false;

    if (caseEntity.hasNoAssignments()) return true;

    return this.isPrimaryAdmin(actor, caseEntity);
  }
}
