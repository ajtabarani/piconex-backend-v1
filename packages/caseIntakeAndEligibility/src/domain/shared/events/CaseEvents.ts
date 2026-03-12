import { PersonId } from "@piconex/iam";
import { CaseAssignmentRole, ClosedStatus } from "../../case";
import { DomainEvent } from "../DomainEvent";
import { CaseId, CaseNoteId, StudentDisabilityId } from "../valueObjects";

export class CaseOpenedByAdmin implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly openedBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class CaseOpenedByStudentIntake implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly studentId: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class CaseUnderReview implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly movedBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class CaseApprovedForAccommodations implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly approvedBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class CaseClosed implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly reason: ClosedStatus,
    public readonly closedBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class CaseCancelled implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly cancelledBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class CaseReopened implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly reopenedBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class IntakeSubmitted implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly submittedBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class IntakeUnderReview implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly movedBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class IntakeApproved implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly approvedBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class IntakeDenied implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly deniedBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class IntakeWithdrawn implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly withdrawnBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class IntakeAbandoned implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly abandonedBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class IntakeSkipped implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly skippedBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class CaseNoteAdded implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly noteId: CaseNoteId,
    public readonly occurredAt: Date,
  ) {}
}

export class CaseAssignmentAdded implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly personId: PersonId,
    public readonly role: CaseAssignmentRole,
    public readonly occurredAt: Date,
  ) {}
}

export class CaseAssignmentRemoved implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly personId: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class CasePrimaryAdminTransferred implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly fromPersonId: PersonId,
    public readonly toPersonId: PersonId,
    public readonly transferredBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class CaseDisabilityAdded implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly studentDisabilityId: StudentDisabilityId,
    public readonly occurredAt: Date,
    public readonly addedBy: PersonId,
  ) {}
}

export class CaseDisabilityRemoved implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly studentDisabilityId: StudentDisabilityId,
    public readonly occurredAt: Date,
    public readonly addedBy: PersonId,
  ) {}
}

export class CasePrimaryDisabilitySet implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly studentDisabilityId: StudentDisabilityId,
    public readonly occurredAt: Date,
    public readonly addedBy: PersonId,
  ) {}
}

export class CasePrimaryDisabilityDemoted implements DomainEvent {
  constructor(
    public readonly caseId: CaseId,
    public readonly studentDisabilityId: StudentDisabilityId,
    public readonly occurredAt: Date,
    public readonly addedBy: PersonId,
  ) {}
}
