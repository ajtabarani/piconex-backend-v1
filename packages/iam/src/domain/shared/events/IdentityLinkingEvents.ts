import { PersonId, ExternalAuthId, AuthProvider } from "../../person";
import { DomainEvent } from "../DomainEvent";

export class ExternalAuthLinked implements DomainEvent {
  constructor(
    public readonly personId: PersonId,
    public readonly provider: AuthProvider,
    public readonly externalAuthId: ExternalAuthId,
    public readonly occurredAt: Date,
  ) {}
}

export class ExternalAuthUnlinked implements DomainEvent {
  constructor(
    public readonly personId: PersonId,
    public readonly provider: AuthProvider,
    public readonly externalAuthId: ExternalAuthId,
    public readonly occurredAt: Date,
  ) {}
}
