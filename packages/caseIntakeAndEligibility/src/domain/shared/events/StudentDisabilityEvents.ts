import { PersonId } from "@piconex/iam";
import { DomainEvent } from "../DomainEvent";
import { CaseId, DisabilityId, StudentDisabilityId } from "../valueObjects";

export class StudentDisabilityCreated implements DomainEvent {
  constructor(
    public readonly studentDisabilityId: StudentDisabilityId,
    public readonly studentId: PersonId,
    public readonly disabilityId: DisabilityId,
    public readonly createdInCaseId: CaseId,
    public readonly createdBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class StudentDisabilityStateChanged implements DomainEvent {
  constructor(
    public readonly studentDisabilityId: StudentDisabilityId,
    public readonly studentId: PersonId,
    public readonly disabilityId: DisabilityId,
    public readonly newState: "ACTIVE" | "INACTIVE",
    public readonly changedBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}