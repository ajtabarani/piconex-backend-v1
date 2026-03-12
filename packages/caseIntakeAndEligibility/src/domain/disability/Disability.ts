import { PersonId } from "@piconex/iam";
import {
  DisabilityId,
  DisabilityCreated,
  DisabilityDescriptionUpdated,
  DomainEvent,
} from "../shared";

export class Disability {
  private readonly disabilityId: DisabilityId;
  private name: string;
  private description: string;

  private readonly createdAt: Date;
  private readonly createdBy: PersonId;

  private updatedAt?: Date;
  private updatedBy?: PersonId;

  private domainEvents: DomainEvent[] = [];

  private constructor(
    disabilityId: DisabilityId,
    name: string,
    description: string,
    createdAt: Date,
    createdBy: PersonId,
    updatedAt?: Date,
    updatedBy?: PersonId,
  ) {
    this.disabilityId = disabilityId;
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
    disabilityId: DisabilityId,
    name: string,
    description: string,
    actorId: PersonId,
  ): Disability {
    const now = new Date();

    const disability = new Disability(
      disabilityId,
      name,
      description,
      now,
      actorId,
    );

    disability.domainEvents.push(
      new DisabilityCreated(disabilityId, actorId, now),
    );

    return disability;
  }

  static restore(
    disabilityId: DisabilityId,
    name: string,
    description: string,
    createdAt: Date,
    createdBy: PersonId,
    updatedAt?: Date,
    updatedBy?: PersonId,
  ): Disability {
    return new Disability(
      disabilityId,
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
    if (!description || description.trim().length === 0) {
      throw new Error("Description cannot be empty");
    }

    const now = new Date();

    this.description = description;
    this.updatedAt = now;
    this.updatedBy = actorId;
    this.domainEvents.push(
      new DisabilityDescriptionUpdated(this.disabilityId, actorId, now),
    );

    this.assertInvariants();
  }

  // Invariants
  private assertInvariants(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Disability name cannot be empty");
    }

    if (!this.description || this.description.trim().length === 0) {
      throw new Error("Disability description cannot be empty");
    }
  }

  // Read Interfaces
  pullDomainEvents(): readonly DomainEvent[] {
    const events = this.domainEvents;
    this.domainEvents = [];
    return events;
  }
}
