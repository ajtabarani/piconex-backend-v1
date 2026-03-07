import {
    PersonId,
    DisabilityId,
    DisabilityCreated,
    DomainEvent
} from "../shared";

export default class Disability {
    private readonly disabilityId: DisabilityId;
    private name: string;
    private description: string;

    private readonly createdAt: Date;
    private readonly createdBy: PersonId;

    private readonly updatedAt?: Date;
    private readonly updatedBy?: PersonId;

    private domainEvents: DomainEvent[] = [];

    private constructor(
        disabilityId: DisabilityId,
        name: string,
        description: string,
        createdAt: Date,
        createdBy: PersonId,
        updatedAt?: Date,
        updatedBy?: PersonId
    ) {
        this.disabilityId = disabilityId;
        this.name = name;
        this.description = description;

        this.createdAt = createdAt;
        this.createdBy = createdBy;

        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
    }

    // Factories
    static create(
        disabilityId: DisabilityId,
        name: string,
        description: string,
        actorId: PersonId
    ): Disability {
        const now = new Date();

        const disability = new Disability(
            disabilityId,
            name,
            description,
            now,
            actorId
        );

        disability.domainEvents.push(
            new DisabilityCreated(disabilityId, actorId, now)
        );

        return disability;
    }

    static restore(
        disabilityId: DisabilityId,
        name: string,
        description: string,
        createdAt: Date,
        createdBy: PersonId,
        updatedAt: Date,
        updatedBy: PersonId
    ): Disability {
        return new Disability(
            disabilityId,
            name,
            description,
            createdAt,
            createdBy,
            updatedAt,
            updatedBy
        )
    }

    private assertInvariants(): void {
        if (!this.name || this.name.trim().length === 0) {
            throw new Error("Disability name cannot be empty");
        }

        if (!this.description || this.description.trim().length === 0) {
            throw new Error("Disability description cannot be empty");
        }
    }
}