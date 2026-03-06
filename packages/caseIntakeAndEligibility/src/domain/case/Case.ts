import {
  CaseId,
  PersonId,
  StudentDisabilityId,
  CaseOpened,
  CaseClosed,
  CaseReopened,
  IntakeSubmitted,
  IntakeApproved,
  IntakeDenied,
  IntakeWithdrawn,
  IntakeAbandoned,
  IntakeSkipped,
  IntakeUnderReview,
  CaseUnderReview,
  CaseApprovedForAccommodations,
  CaseNoteAdded,
  CaseAssignmentAdded,
  CaseAssignmentRemoved,
  CaseDisabilityAdded,
  CasePrimaryDisabilitySet,
  DomainEvent,
} from "../shared";

import { CaseNote, Intake } from "./entities";
import {
  CaseState,
  ClosedStatus,
  CaseDisability,
  CaseAssignment,
  CaseAssignmentRole,
} from "./valueObjects";

export default class Case {
  private readonly caseId: CaseId;
  private readonly studentId: PersonId;

  private intake?: Intake;
  private notes: CaseNote[] = [];
  // NEED CASEFLAGS
  private disabilities: CaseDisability[] = [];
  private assignments: CaseAssignment[] = [];

  private state: CaseState;
  private stateChangedAt: Date;
  private closedStatus?: ClosedStatus;

  private readonly openedAt: Date;
  private readonly openedBy: PersonId;

  private closedAt?: Date;
  private closedBy?: PersonId;

  private reopenedAt?: Date;
  private reopenedBy?: PersonId;
  private reopenedReason?: string;

  private domainEvents: DomainEvent[] = [];

  private constructor(
    caseId: CaseId,
    studentId: PersonId,
    intake: Intake | undefined,
    notes: CaseNote[],
    disabilities: CaseDisability[],
    assignments: CaseAssignment[],
    state: CaseState,
    stateChangedAt: Date,
    closedStatus: ClosedStatus | undefined,
    openedAt: Date,
    openedBy: PersonId,
    closedAt?: Date,
    closedBy?: PersonId,
    reopenedAt?: Date,
    reopenedBy?: PersonId,
    reopenedReason?: string,
  ) {
    this.caseId = caseId;
    this.studentId = studentId;

    this.intake = intake;
    this.notes = notes;
    this.disabilities = disabilities;
    this.assignments = assignments;

    this.state = state;
    this.stateChangedAt = stateChangedAt;
    this.closedStatus = closedStatus;

    this.openedAt = openedAt;
    this.openedBy = openedBy;

    this.closedAt = closedAt;
    this.closedBy = closedBy;

    this.reopenedAt = reopenedAt;
    this.reopenedBy = reopenedBy;
    this.reopenedReason = reopenedReason;

    this.assertInvariants();
  }

  // Factories
  static createByAdmin(
    caseId: CaseId,
    studentId: PersonId,
    actorId: PersonId,
  ): Case {
    const now = new Date();

    const assignments = [
      CaseAssignment.assign(actorId, CaseAssignmentRole.Primary, actorId),
    ];

    const caseEntity = new Case(
      caseId,
      studentId,
      undefined,
      [],
      [],
      assignments,
      CaseState.AdminCreated,
      now,
      undefined,
      now,
      actorId,
    );

    caseEntity.domainEvents.push(new CaseOpened(caseId, actorId, now));
    caseEntity.domainEvents.push(
      new CaseAssignmentAdded(caseId, actorId, CaseAssignmentRole.Primary, now),
    );

    return caseEntity;
  }

  static createFromStudentIntake(
    caseId: CaseId,
    studentId: PersonId,
    actorId: PersonId,
  ): Case {
    const now = new Date();

    const intake = Intake.createNew();

    const caseEntity = new Case(
      caseId,
      studentId,
      intake,
      [],
      [],
      [],
      CaseState.IntakeSubmitted,
      now,
      undefined,
      now,
      actorId,
    );

    caseEntity.domainEvents.push(new CaseOpened(caseId, actorId, now));
    caseEntity.domainEvents.push(new IntakeSubmitted(caseId, actorId, now));

    return caseEntity;
  }

  static restore(
    caseId: CaseId,
    studentId: PersonId,
    intake: Intake | undefined,
    notes: CaseNote[],
    disabilities: CaseDisability[],
    assignments: CaseAssignment[],
    state: CaseState,
    stateChangedAt: Date,
    closedStatus: ClosedStatus | undefined,
    openedAt: Date,
    openedBy: PersonId,
    closedAt?: Date,
    closedBy?: PersonId,
    reopenedAt?: Date,
    reopenedBy?: PersonId,
    reopenedReason?: string,
  ): Case {
    return new Case(
      caseId,
      studentId,
      intake,
      notes,
      disabilities,
      assignments,
      state,
      stateChangedAt,
      closedStatus,
      openedAt,
      openedBy,
      closedAt,
      closedBy,
      reopenedAt,
      reopenedBy,
      reopenedReason,
    );
  }

  // Commands
  submitIntake(actorId: PersonId): void {
    if (this.state !== CaseState.AdminCreated) {
      throw new Error("Intake can only be submitted from admin created state");
    }

    this.intake = Intake.createNew();
    this.state = CaseState.IntakeUnderReview;
    this.stateChangedAt = new Date();

    this.domainEvents.push(
      new IntakeSubmitted(this.caseId, actorId, new Date()),
    );

    this.domainEvents.push(
      new IntakeUnderReview(this.caseId, actorId, new Date()),
    );

    this.domainEvents.push(
      new CaseUnderReview(this.caseId, actorId, new Date()),
    );
  }

  skipIntake(actorId: PersonId): void {
    if (this.state !== CaseState.AdminCreated) {
      throw new Error("Can only skip intake from admin created state");
    }

    this.state = CaseState.ApprovedForAccommodations;
    this.stateChangedAt = new Date();

    this.domainEvents.push(new IntakeSkipped(this.caseId, actorId, new Date()));
    this.domainEvents.push(
      new CaseApprovedForAccommodations(this.caseId, actorId, new Date()),
    );
  }

  approveIntake(actorId: PersonId): void {
    if (!this.intake) {
      throw new Error("No intake exists");
    }
    if (this.state !== CaseState.IntakeUnderReview) {
      throw new Error("Case must be under review");
    }

    this.intake.approve();

    this.state = CaseState.ApprovedForAccommodations;
    this.stateChangedAt = new Date();

    this.domainEvents.push(
      new IntakeApproved(this.caseId, actorId, new Date()),
    );
    this.domainEvents.push(
      new CaseApprovedForAccommodations(this.caseId, actorId, new Date()),
    );
  }

  denyIntake(actorId: PersonId): void {
    if (!this.intake) {
      throw new Error("No intake exists");
    }

    this.intake.deny();
    this.close(ClosedStatus.DeniedIntake, actorId);

    this.domainEvents.push(new IntakeDenied(this.caseId, actorId, new Date()));
  }

  withdrawIntake(actorId: PersonId): void {
    if (!this.intake) {
      throw new Error("No intake exists");
    }

    this.intake.withdraw();
    this.close(ClosedStatus.Withdrawn, actorId);

    this.domainEvents.push(
      new IntakeWithdrawn(this.caseId, actorId, new Date()),
    );
  }

  abandonIntake(actorId: PersonId): void {
    if (!this.intake) {
      throw new Error("No intake exists");
    }

    this.intake.withdraw();
    this.close(ClosedStatus.Abandoned, actorId);

    this.domainEvents.push(
      new IntakeAbandoned(this.caseId, actorId, new Date()),
    );
  }

  close(reason: ClosedStatus, actorId: PersonId): void {
    if (this.state === CaseState.Closed) {
      throw new Error("Case already closed");
    }

    this.state = CaseState.Closed;
    this.stateChangedAt = new Date();

    this.closedStatus = reason;
    this.closedAt = new Date();
    this.closedBy = actorId;

    this.domainEvents.push(
      new CaseClosed(this.caseId, reason, actorId, new Date()),
    );
  }

  reopen(actorId: PersonId, reason: string): void {
    if (this.state !== CaseState.Closed) {
      throw new Error("Only closed cases can be reopened");
    }

    switch (this.closedStatus) {
      case ClosedStatus.DeniedIntake:
      case ClosedStatus.Withdrawn:
      case ClosedStatus.Abandoned:
      case ClosedStatus.AccommodationsComplete:
        this.state = CaseState.ApprovedForAccommodations;
        break;
      default:
        throw new Error("Cannot reopen case from its current closed status");
    }

    this.stateChangedAt = new Date();

    this.closedStatus = undefined;
    this.closedAt = undefined;
    this.closedBy = undefined;

    this.reopenedAt = new Date();
    this.reopenedBy = actorId;
    this.reopenedReason = reason;

    this.domainEvents.push(new CaseReopened(this.caseId, actorId, new Date()));
  }

  addNote(note: CaseNote): void {
    this.notes.push(note);

    this.domainEvents.push(
      new CaseNoteAdded(this.caseId, note.getNoteId(), new Date()),
    );
  }

  assignAdmin(
    personId: PersonId,
    role: CaseAssignmentRole,
    actorId: PersonId,
  ): void {
    if (
      this.assignments.some(
        (a) => a.getPersonId().equals(personId) && a.isActive(),
      )
    ) {
      throw new Error("Admin already assigned");
    }

    if (
      role === CaseAssignmentRole.Primary &&
      this.assignments.some((a) => a.isPrimary() && a.isActive())
    ) {
      throw new Error("Case already has a primary admin");
    }

    const assignment = CaseAssignment.assign(personId, role, actorId);
    this.assignments.push(assignment);

    if (this.state === CaseState.IntakeSubmitted) {
      if (!this.intake) {
        throw new Error("No intake exists");
      }

      this.intake.moveToUnderReview();
      this.state = CaseState.IntakeUnderReview;
      this.stateChangedAt = new Date();

      this.domainEvents.push(
        new IntakeUnderReview(this.caseId, personId, new Date()),
      );
      this.domainEvents.push(
        new CaseUnderReview(this.caseId, personId, new Date()),
      );
    }

    this.domainEvents.push(
      new CaseAssignmentAdded(this.caseId, personId, role, new Date()),
    );
  }

  unassignAdmin(personId: PersonId, actorId: PersonId): void {
    const activeAssignments = this.assignments.filter((a) => a.isActive());
    const target = activeAssignments.find((a) =>
      a.getPersonId().equals(personId),
    );

    if (!target) {
      throw new Error("Active assignment not found");
    }

    if (
      target.isPrimary() &&
      this.state !== CaseState.IntakeSubmitted &&
      activeAssignments.length === 1
    ) {
      throw new Error(
        "Cannot remove the only active primary admin from this case",
      );
    }

    this.assignments = this.assignments.map((a) => {
      if (a.getPersonId().equals(personId) && a.isActive()) {
        return a.unassign(actorId);
      }
      return a;
    });

    this.domainEvents.push(
      new CaseAssignmentRemoved(this.caseId, personId, new Date()),
    );
  }

  addDisability(
    studentDisabilityId: StudentDisabilityId,
    actorId: PersonId,
  ): void {
    if (
      this.disabilities.some((d) =>
        d.getStudentDisabilityId().equals(studentDisabilityId),
      )
    ) {
      throw new Error("Disability already added");
    }

    const disability = CaseDisability.createNew(studentDisabilityId, actorId);
    this.disabilities.push(disability);

    this.domainEvents.push(
      new CaseDisabilityAdded(this.caseId, studentDisabilityId, new Date()),
    );
  }

  setPrimaryDisability(studentDisabilityId: StudentDisabilityId): void {
    if (
      !this.disabilities.some((d) =>
        d.getStudentDisabilityId().equals(studentDisabilityId),
      )
    ) {
      throw new Error("Disability not associated with case");
    }

    this.disabilities = this.disabilities.map((d) =>
      d.getStudentDisabilityId().equals(studentDisabilityId)
        ? d.makePrimary()
        : d.removePrimary(),
    );

    this.domainEvents.push(
      new CasePrimaryDisabilitySet(
        this.caseId,
        studentDisabilityId,
        new Date(),
      ),
    );
  }

  // Invariants
  private assertInvariants(): void {
    // Closed Status
    if (this.state === CaseState.Closed) {
      if (!this.closedStatus || !this.closedAt || !this.closedBy) {
        throw new Error("Closed case must have close metadata");
      }
    } else {
      if (this.closedStatus || this.closedAt || this.closedBy) {
        throw new Error("Only closed cases can have close metadata");
      }
    }

    // Case Assignments
    const activePrimaryAssignments = this.assignments.filter(
      (a) => a.isActive() && a.isPrimary(),
    );

    if (activePrimaryAssignments.length > 1) {
      throw new Error("Only one primary admin allowed");
    }

    if (this.state !== CaseState.IntakeSubmitted) {
      if (activePrimaryAssignments.length !== 1) {
        throw new Error(
          "Case must have exactly one active primary admin unless it is intake submitted",
        );
      }
    }

    const activeAssignmentPersonIds = this.assignments
      .filter((a) => a.isActive())
      .map((a) => a.getPersonId().toString());

    if (
      new Set(activeAssignmentPersonIds).size !==
      activeAssignmentPersonIds.length
    ) {
      throw new Error("Case cannot have duplicate active assignments");
    }

    // Disabilities
    const disabilityIds = this.disabilities.map((d) =>
      d.getStudentDisabilityId().toString(),
    );

    if (new Set(disabilityIds).size !== disabilityIds.length) {
      throw new Error("Case cannot have duplicate disabilities");
    }

    const primaryDisabilities = this.disabilities.filter((d) =>
      d.isPrimaryDisability(),
    );

    if (primaryDisabilities.length > 1) {
      throw new Error("Only one primary disability allowed");
    }
  }

  // Read Interfaces
  pullDomainEvents(): readonly DomainEvent[] {
    const events = this.domainEvents;
    this.domainEvents = [];
    return events;
  }

  getState(): CaseState {
    return this.state;
  }
}
