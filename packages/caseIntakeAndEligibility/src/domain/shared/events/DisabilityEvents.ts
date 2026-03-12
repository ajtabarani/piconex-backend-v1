import { PersonId } from "@piconex/iam";
import { DomainEvent } from "../DomainEvent";
import { DisabilityId } from "../valueObjects";

export class DisabilityCreated implements DomainEvent {
  constructor(
    public readonly disabilityId: DisabilityId,
    public readonly createdBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class DisabilityDescriptionUpdated implements DomainEvent {
  constructor(
    public readonly disabilityId: DisabilityId,
    public readonly updatedBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}
