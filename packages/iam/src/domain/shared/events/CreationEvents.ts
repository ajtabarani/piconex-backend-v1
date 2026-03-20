import { DomainEvent } from "..";
import { ImportJobId, PersonId, Role } from "../..";

export class PersonCreated implements DomainEvent {
  constructor(
    public readonly personId: PersonId,
    public readonly roles: Role[],
    public readonly occurredAt: Date,
  ) {}
}

export class PersonImported implements DomainEvent {
  constructor(
    public readonly personId: PersonId,
    public readonly importJobId: ImportJobId,
    public readonly occurredAt: Date,
  ) {}
}
