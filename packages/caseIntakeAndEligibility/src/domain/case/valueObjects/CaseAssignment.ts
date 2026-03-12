import { PersonId } from "@piconex/iam";

export enum CaseAssignmentRole {
  Primary = "PRIMARY",
  Support = "SUPPORT",
}

export class CaseAssignment {
  private readonly personId: PersonId;
  private readonly role: CaseAssignmentRole;

  private readonly assignedAt: Date;
  private readonly assignedBy: PersonId;

  private readonly unassignedAt?: Date;
  private readonly unassignedBy?: PersonId;

  private constructor(
    personId: PersonId,
    role: CaseAssignmentRole,
    assignedAt: Date,
    assignedBy: PersonId,
    unassignedAt?: Date,
    unassignedBy?: PersonId,
  ) {
    this.personId = personId;
    this.role = role;
    this.assignedAt = assignedAt;
    this.assignedBy = assignedBy;
    this.unassignedAt = unassignedAt;
    this.unassignedBy = unassignedBy;
  }

  static assign(
    personId: PersonId,
    role: CaseAssignmentRole,
    assignedBy: PersonId,
  ): CaseAssignment {
    return new CaseAssignment(personId, role, new Date(), assignedBy);
  }

  static restore(props: {
    personId: PersonId;
    role: CaseAssignmentRole;
    assignedAt: Date;
    assignedBy: PersonId;
    unassignedAt?: Date;
    unassignedBy?: PersonId;
  }): CaseAssignment {
    return new CaseAssignment(
      props.personId,
      props.role,
      props.assignedAt,
      props.assignedBy,
      props.unassignedAt,
      props.unassignedBy,
    );
  }

  unassign(by: PersonId): CaseAssignment {
    if (this.unassignedAt) {
      throw new Error("Assignment already unassigned");
    }

    return new CaseAssignment(
      this.personId,
      this.role,
      this.assignedAt,
      this.assignedBy,
      new Date(),
      by,
    );
  }

  isActive(): boolean {
    return !this.unassignedAt;
  }

  isPrimary(): boolean {
    return this.role === CaseAssignmentRole.Primary;
  }

  isSupport(): boolean {
    return this.role === CaseAssignmentRole.Support;
  }

  getPersonId(): PersonId {
    return this.personId;
  }

  getRole(): CaseAssignmentRole {
    return this.role;
  }
}
