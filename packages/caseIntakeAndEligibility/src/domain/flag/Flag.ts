import { PersonId } from "@piconex/iam";
import {
  FlagId,
  FlagCreated,
  FlagDescriptionUpdated,
  DomainEvent,
} from "../shared";

export class Flag {
  private readonly flagId: FlagId;
  private name: string;
  private description: string;

  private readonly createdAt: Date;
  private readonly createdBy: PersonId;

  private updatedAt?: Date;
  private updatedBy?: PersonId;

  private domainEvents: DomainEvent[] = [];

  private constructor(
    flagId: FlagId,
    name: string,
    description: string,
    createdAt: Date,
    createdBy: PersonId,
    updatedAt?: Date,
    updatedBy?: PersonId,
  ) {
    this.flagId = flagId;
    this.name = name;
    this.description = description;

    this.createdAt = createdAt;
    this.createdBy = createdBy;

    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;

    this.assertInvariants();
  }

  // Factories
  static create(
    flagId: FlagId,
    name: string,
    description: string,
    actorId: PersonId,
  ): Flag {
    const now = new Date();

    const flag = new Flag(flagId, name, description, now, actorId);

    flag.domainEvents.push(new FlagCreated(flagId, actorId, now));

    return flag;
  }

  static restore(
    flagId: FlagId,
    name: string,
    description: string,
    createdAt: Date,
    createdBy: PersonId,
    updatedAt?: Date,
    updatedBy?: PersonId,
  ): Flag {
    return new Flag(
      flagId,
      name,
      description,
      createdAt,
      createdBy,
      updatedAt,
      updatedBy,
    );
  }

  // Commands
  updateDescription(description: string, actorId: PersonId): void {
    const now = new Date();

    this.description = description;
    this.updatedAt = now;
    this.updatedBy = actorId;
    this.domainEvents.push(
      new FlagDescriptionUpdated(this.flagId, actorId, now),
    );

    this.assertInvariants();
  }

  // Invariants
  private assertInvariants(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Flag name cannot be empty");
    }

    if (!this.description || this.description.trim().length === 0) {
      throw new Error("Flag description cannot be empty");
    }
  }

  // Read Interfaces
  pullDomainEvents(): readonly DomainEvent[] {
    const events = this.domainEvents;
    this.domainEvents = [];
    return events;
  }
}
