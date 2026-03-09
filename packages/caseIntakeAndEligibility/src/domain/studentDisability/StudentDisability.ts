import { CaseId, DisabilityId, DomainEvent, PersonId, StudentDisabilityId } from "../shared";
import { StudentDisabilityState } from "./valueObjects/studentDisability";

export default class StudentDisability {
    private readonly studentDisabilityId: StudentDisabilityId;
    private readonly studentId: PersonId;
    private readonly disabilityId: DisabilityId;

    private state: StudentDisabilityState;
    private stateChangedAt: Date;
    private stateChangedBy: PersonId;

    private readonly createdAt: Date;
    private readonly createdBy: PersonId;
    private readonly createdInCaseId: CaseId;

    private updatedAt: Date;
    private updatedBy: PersonId;

    private domainEvents: DomainEvent[] = [];

    private constructor(
        studentDisabilityId: StudentDisabilityId,
        studentId: PersonId,
        disabilityId: DisabilityId,
        state: StudentDisabilityState,
        stateChangedAt: Date,
        stateChangedBy: PersonId,
        createdAt: Date,
        createdBy: PersonId,
        createdInCaseId: CaseId,
        updatedAt: Date,
        updatedBy: PersonId
    ) {
        this.studentDisabilityId = studentDisabilityId;
        this.studentId = studentId;
        this.disabilityId = disabilityId;
        
        this.state = state;
        this.stateChangedAt = stateChangedAt;
        this.stateChangedBy = stateChangedBy;

        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.createdInCaseId = createdInCaseId;

        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
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
            StudentDisabilityState.Active,
            now,
            actorId,
            now,
            actorId,
            createdInCaseId,
            now,
            actorId
        );

        return studentDisability;
    }
}