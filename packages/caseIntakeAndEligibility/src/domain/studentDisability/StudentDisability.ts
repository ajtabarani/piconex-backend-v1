import { PersonId } from "@piconex/iam";
import { CaseId, DisabilityId, DomainEvent, StudentDisabilityId } from "../shared";
import { StudentDisabilityState } from "./valueObjects/studentDisability";
import { StudentDisabilityCreated, StudentDisabilityStateChanged } from "../shared/events/StudentDisabilityEvents";

export default class StudentDisability {
    private readonly studentDisabilityId: StudentDisabilityId;
    private readonly studentId: PersonId;
    private readonly disabilityId: DisabilityId;

    private readonly createdAt: Date;
    private readonly createdBy: PersonId;
    private readonly createdInCaseId: CaseId;

    private state: StudentDisabilityState;
    private stateChangedAt?: Date;
    private stateChangedBy?: PersonId;

    private updatedAt?: Date;
    private updatedBy?: PersonId;

    private domainEvents: DomainEvent[] = [];

    private constructor(
        studentDisabilityId: StudentDisabilityId,
        studentId: PersonId,
        disabilityId: DisabilityId,
        createdAt: Date,
        createdBy: PersonId,
        createdInCaseId: CaseId,
        state: StudentDisabilityState,
        stateChangedAt?: Date,
        stateChangedBy?: PersonId,
        updatedAt?: Date,
        updatedBy?: PersonId
    ) {
        this.studentDisabilityId = studentDisabilityId;
        this.studentId = studentId;
        this.disabilityId = disabilityId;

        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.createdInCaseId = createdInCaseId;
        
        this.state = state;
        this.stateChangedAt = stateChangedAt;
        this.stateChangedBy = stateChangedBy;

        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;

        this.assertInvariants();
    }

    // Factories
    static create(
        studentDisabilityId: StudentDisabilityId,
        studentId: PersonId,
        disabilityId: DisabilityId,
        actorId: PersonId,
        createdInCaseId: CaseId
    ): StudentDisability {
        const now = new Date();

        const studentDisability = new StudentDisability(
            studentDisabilityId,
            studentId,
            disabilityId,
            now,
            actorId,
            createdInCaseId,
            StudentDisabilityState.Active
        );

        studentDisability.domainEvents.push(
            new StudentDisabilityCreated(
                studentDisabilityId,
                studentId,
                disabilityId,
                createdInCaseId,
                actorId,
                now
            )
        );

        return studentDisability;
    }

    static restore(
        studentDisabilityId: StudentDisabilityId,
        studentId: PersonId,
        disabilityId: DisabilityId,
        createdAt: Date,
        createdBy: PersonId,
        createdInCaseId: CaseId,
        state: StudentDisabilityState,
        stateChangedAt?: Date,
        stateChangedBy?: PersonId,
        updatedAt?: Date,
        updatedBy?: PersonId
    ): StudentDisability {
        return new StudentDisability(
            studentDisabilityId,
            studentId,
            disabilityId,
            createdAt,
            createdBy,
            createdInCaseId,
            state,
            stateChangedAt,
            stateChangedBy,
            updatedAt,
            updatedBy
        );
    }

    // Commands
    activate(actorId: PersonId): void {
        if (this.state === StudentDisabilityState.Active) {
            return;
        }

        if (this.state !== StudentDisabilityState.Inactive) {
            throw new Error(`Cannot activate from state ${this.state}`);
        }

        this.state = StudentDisabilityState.Active;
        this.stateChangedAt = new Date();
        this.stateChangedBy = actorId;

        this.domainEvents.push(
            new StudentDisabilityStateChanged(
                this.studentDisabilityId,
                this.studentId,
                this.disabilityId,
                this.state,
                actorId,
                this.stateChangedAt
            )
        );

        this.assertInvariants();
    }

    inactivate(actorId: PersonId): void {
        if (this.state === StudentDisabilityState.Inactive) {
            // Already inactive, nothing to do
            return;
        }

        if (this.state !== StudentDisabilityState.Active) {
            throw new Error(`Cannot inactivate from state ${this.state}`);
        }

        this.state = StudentDisabilityState.Inactive;
        this.stateChangedAt = new Date();
        this.stateChangedBy = actorId;

        // Domain event for state change
        this.domainEvents.push(
            new StudentDisabilityStateChanged(
                this.studentDisabilityId,
                this.studentId,
                this.disabilityId,
                this.state,
                actorId,
                this.stateChangedAt
            )
        );

        this.assertInvariants();
    }

    // Invariants
    private assertInvariants(): void {
        if ((this.stateChangedAt && !this.stateChangedBy) || 
            (!this.stateChangedAt && this.stateChangedBy)) {
            throw new Error("State change metadata must have both stateChangedAt and stateChangedBy or neither");
        }

        if ((this.updatedAt && !this.updatedBy) ||
            (!this.updatedAt && this.updatedBy)) {
            throw new Error("Updated metadata must have both updatedAt and updatedBy or neither");
        }

        if (this.updatedAt && this.updatedAt < this.createdAt) {
            throw new Error("updatedAt cannot be before createdAt");
        }
    }

    // Read Interfaces
    pullDomainEvents(): readonly DomainEvent[] {
        const events = this.domainEvents;
        this.domainEvents = [];
        return events;
    }
}