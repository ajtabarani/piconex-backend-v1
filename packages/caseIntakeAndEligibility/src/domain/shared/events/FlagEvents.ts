import { PersonId } from "@piconex/iam";
import { DomainEvent } from "../DomainEvent";
import { FlagId } from "../valueObjects";

export class FlagCreated implements DomainEvent {
  constructor(
    public readonly flagId: FlagId,
    public readonly createdBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}

export class FlagDescriptionUpdated implements DomainEvent {
  constructor(
    public readonly flagId: FlagId,
    public readonly updatedBy: PersonId,
    public readonly occurredAt: Date,
  ) {}
}
