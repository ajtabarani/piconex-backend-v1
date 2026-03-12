import { PersonId } from "@piconex/iam";
import {
  CaseId,
  StudentDisabilityId,
  CaseOpenedByAdmin,
  CaseOpenedByStudentIntake,
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
  CaseCancelled,
  CaseNoteAdded,
  CaseAssignmentAdded,
  CaseAssignmentRemoved,
  CasePrimaryAdminTransferred,
  CaseDisabilityAdded,
  CaseDisabilityRemoved,
  CasePrimaryDisabilitySet,
  CasePrimaryDisabilityDemoted,
  DomainEvent,
} from "../shared";

import { CaseNote, Intake, IntakeState } from "./entities";
import {
  ClosedStatus,
  CaseDisability,
  CaseAssignment,
  CaseAssignmentRole,
  CaseState,
} from "./valueObjects";

export class Case {
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

    caseEntity.domainEvents.push(new CaseOpenedByAdmin(caseId, actorId, now));
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

    caseEntity.domainEvents.push(new IntakeSubmitted(caseId, actorId, now));

    caseEntity.domainEvents.push(
      new CaseOpenedByStudentIntake(caseId, actorId, now),
    );

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

    const now = new Date();

    this.intake = Intake.createNew();
    this.intake.moveToUnderReview();

    this.state = CaseState.IntakeUnderReview;
    this.stateChangedAt = now;

    this.domainEvents.push(new IntakeSubmitted(this.caseId, actorId, now));

    this.domainEvents.push(new IntakeUnderReview(this.caseId, actorId, now));

    this.domainEvents.push(new CaseUnderReview(this.caseId, actorId, now));

    this.assertInvariants();
  }

  skipIntake(actorId: PersonId): void {
    if (this.state !== CaseState.AdminCreated) {
      throw new Error("Can only skip intake from admin created state");
    }

    const now = new Date();

    this.state = CaseState.ApprovedForAccommodations;
    this.stateChangedAt = now;

    this.domainEvents.push(new IntakeSkipped(this.caseId, actorId, now));
    this.domainEvents.push(
      new CaseApprovedForAccommodations(this.caseId, actorId, now),
    );

    this.assertInvariants();
  }

  approveIntake(actorId: PersonId): void {
    if (!this.intake) {
      throw new Error("No intake exists");
    }
    if (this.state !== CaseState.IntakeUnderReview) {
      throw new Error("Case must be under review");
    }

    const now = new Date();

    this.intake.approve();

    this.state = CaseState.ApprovedForAccommodations;
    this.stateChangedAt = now;

    this.domainEvents.push(new IntakeApproved(this.caseId, actorId, now));
    this.domainEvents.push(
      new CaseApprovedForAccommodations(this.caseId, actorId, now),
    );

    this.assertInvariants();
  }

  denyIntake(actorId: PersonId): void {
    if (!this.intake) {
      throw new Error("No intake exists");
    }

    if (this.state !== CaseState.IntakeUnderReview) {
      throw new Error("Case must be under review");
    }

    const now = new Date();

    this.intake.deny();

    this.domainEvents.push(new IntakeDenied(this.caseId, actorId, now));

    this.close(ClosedStatus.DeniedIntake, actorId, now);

    this.assertInvariants();
  }

  withdrawIntake(actorId: PersonId): void {
    if (!this.intake) {
      throw new Error("No intake exists");
    }

    if (this.state !== CaseState.IntakeUnderReview) {
      throw new Error("Case must be under review");
    }

    const now = new Date();

    this.intake.withdraw();

    this.domainEvents.push(new IntakeWithdrawn(this.caseId, actorId, now));

    this.close(ClosedStatus.Withdrawn, actorId, now);

    this.assertInvariants();
  }

  abandonIntake(actorId: PersonId): void {
    if (!this.intake) {
      throw new Error("No intake exists");
    }

    if (this.state !== CaseState.IntakeUnderReview) {
      throw new Error("Case must be under review");
    }

    const now = new Date();

    this.intake.abandon();

    this.domainEvents.push(new IntakeAbandoned(this.caseId, actorId, now));

    this.close(ClosedStatus.Abandoned, actorId, now);

    this.assertInvariants();
  }

  cancelCase(actorId: PersonId): void {
    if (this.state !== CaseState.AdminCreated) {
      throw new Error("Case cannot be cancelled from this state");
    }

    const now = new Date();

    this.domainEvents.push(new CaseCancelled(this.caseId, actorId, now));

    this.close(ClosedStatus.Cancelled, actorId, now);

    this.assertInvariants();
  }

  private close(reason: ClosedStatus, actorId: PersonId, now: Date): void {
    this.state = CaseState.Closed;
    this.stateChangedAt = now;

    this.closedStatus = reason;
    this.closedAt = now;
    this.closedBy = actorId;

    this.domainEvents.push(new CaseClosed(this.caseId, reason, actorId, now));
  }

  reopen(actorId: PersonId, reason: string): void {
    if (this.state !== CaseState.Closed) {
      throw new Error("Only closed cases can be reopened");
    }

    if (this.closedStatus !== ClosedStatus.AccommodationsComplete) {
      throw new Error("Only completed cases can be reopened");
    }

    const now = new Date();

    this.state = CaseState.ApprovedForAccommodations;
    this.stateChangedAt = now;

    this.closedStatus = undefined;
    this.closedAt = undefined;
    this.closedBy = undefined;

    this.reopenedAt = now;
    this.reopenedBy = actorId;
    this.reopenedReason = reason;

    this.domainEvents.push(new CaseReopened(this.caseId, actorId, now));

    this.assertInvariants();
  }

  addNote(note: CaseNote): void {
    if (this.state === CaseState.Closed) {
      throw new Error("Cannot modify a closed case");
    }

    this.notes.push(note);

    this.domainEvents.push(
      new CaseNoteAdded(this.caseId, note.getNoteId(), new Date()),
    );

    this.assertInvariants();
  }

  assignAdmin(
    personId: PersonId,
    role: CaseAssignmentRole,
    actorId: PersonId,
  ): void {
    if (this.state === CaseState.Closed) {
      throw new Error("Cannot modify a closed case");
    }

    // if (
    //   role === CaseAssignmentRole.Primary &&
    //   this.assignments.some((a) => a.isPrimary() && a.isActive())
    // ) {
    //   throw new Error("Case already has a primary admin");
    // }

    const now = new Date();

    if (this.state === CaseState.IntakeSubmitted) {
      if (!this.intake) {
        throw new Error("No intake exists");
      }

      this.intake.moveToUnderReview();
      this.state = CaseState.IntakeUnderReview;
      this.stateChangedAt = now;

      this.domainEvents.push(new IntakeUnderReview(this.caseId, actorId, now));

      this.domainEvents.push(new CaseUnderReview(this.caseId, actorId, now));
    }

    const assignment = CaseAssignment.assign(personId, role, actorId);
    this.assignments.push(assignment);

    this.domainEvents.push(
      new CaseAssignmentAdded(this.caseId, personId, role, now),
    );

    this.assertInvariants();
  }

  unassignAdmin(personId: PersonId, actorId: PersonId): void {
    if (this.state === CaseState.Closed) {
      throw new Error("Cannot modify a closed case");
    }

    const activeAssignments = this.assignments.filter((a) => a.isActive());
    const target = activeAssignments.find((a) =>
      a.getPersonId().equals(personId),
    );

    if (!target) {
      throw new Error("Active assignment not found");
    }

    // if (
    //   target.isPrimary() &&
    //   this.state !== CaseState.IntakeSubmitted &&
    //   activeAssignments.length === 1
    // ) {
    //   throw new Error(
    //     "Cannot remove the only active primary admin from this case",
    //   );
    // }

    this.assignments = this.assignments.map((a) => {
      if (a.getPersonId().equals(personId) && a.isActive()) {
        return a.unassign(actorId);
      }
      return a;
    });

    this.domainEvents.push(
      new CaseAssignmentRemoved(this.caseId, personId, new Date()),
    );

    this.assertInvariants();
  }

  transferPrimaryAdmin(
    fromPersonId: PersonId,
    toPersonId: PersonId,
    actorId: PersonId,
  ): void {
    if (this.state === CaseState.Closed) {
      throw new Error("Cannot modify a closed case");
    }

    const now = new Date();

    const currentPrimary = this.assignments.find(
      (a) =>
        a.isActive() && a.isPrimary() && a.getPersonId().equals(fromPersonId),
    );

    if (!currentPrimary) {
      throw new Error("Current primary admin not found");
    }

    const targetSupport = this.assignments.find(
      (a) =>
        a.isActive() && a.isSupport() && a.getPersonId().equals(toPersonId),
    );

    if (!targetSupport) {
      throw new Error("Target admin must be an active support admin");
    }

    // Unassign both current roles
    this.assignments = this.assignments.map((a) => {
      if (
        a.isActive() &&
        (a.getPersonId().equals(fromPersonId) ||
          a.getPersonId().equals(toPersonId))
      ) {
        return a.unassign(actorId);
      }
      return a;
    });

    // Create swapped roles
    const newPrimary = CaseAssignment.assign(
      toPersonId,
      CaseAssignmentRole.Primary,
      actorId,
    );

    const newSupport = CaseAssignment.assign(
      fromPersonId,
      CaseAssignmentRole.Support,
      actorId,
    );

    this.assignments.push(newPrimary);
    this.assignments.push(newSupport);

    // Domain events
    this.domainEvents.push(
      new CaseAssignmentRemoved(this.caseId, fromPersonId, now),
    );

    this.domainEvents.push(
      new CaseAssignmentRemoved(this.caseId, toPersonId, now),
    );

    this.domainEvents.push(
      new CaseAssignmentAdded(
        this.caseId,
        toPersonId,
        CaseAssignmentRole.Primary,
        now,
      ),
    );

    this.domainEvents.push(
      new CaseAssignmentAdded(
        this.caseId,
        fromPersonId,
        CaseAssignmentRole.Support,
        now,
      ),
    );

    this.domainEvents.push(
      new CasePrimaryAdminTransferred(
        this.caseId,
        fromPersonId,
        toPersonId,
        actorId,
        now,
      ),
    );

    this.assertInvariants();
  }

  addDisability(
    studentDisabilityId: StudentDisabilityId,
    actorId: PersonId,
  ): void {
    if (this.state === CaseState.Closed) {
      throw new Error("Cannot modify a closed case");
    }

    // if (
    //   this.disabilities.some((d) =>
    //     d.getStudentDisabilityId().equals(studentDisabilityId),
    //   )
    // ) {
    //   throw new Error("Disability already added");
    // }

    const disability = CaseDisability.createNew(studentDisabilityId, actorId);
    this.disabilities.push(disability);

    this.domainEvents.push(
      new CaseDisabilityAdded(
        this.caseId,
        studentDisabilityId,
        new Date(),
        actorId,
      ),
    );

    this.assertInvariants();
  }

  removeDisability(
    studentDisabilityId: StudentDisabilityId,
    actorId: PersonId,
  ): void {
    if (this.state === CaseState.Closed) {
      throw new Error("Cannot modify a closed case");
    }

    const exists = this.disabilities.some((d) =>
      d.getStudentDisabilityId().equals(studentDisabilityId),
    );

    if (!exists) {
      throw new Error("Disability not associated with case");
    }

    this.disabilities = this.disabilities.filter(
      (d) => !d.getStudentDisabilityId().equals(studentDisabilityId),
    );

    this.domainEvents.push(
      new CaseDisabilityRemoved(
        this.caseId,
        studentDisabilityId,
        new Date(),
        actorId,
      ),
    );

    this.assertInvariants();
  }

  setPrimaryDisability(
    studentDisabilityId: StudentDisabilityId,
    actorId: PersonId,
  ): void {
    if (this.state === CaseState.Closed) {
      throw new Error("Cannot modify a closed case");
    }

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
        actorId,
      ),
    );

    this.assertInvariants();
  }

  demotePrimaryDisability(
    studentDisabilityId: StudentDisabilityId,
    actorId: PersonId,
  ): void {
    if (this.state === CaseState.Closed) {
      throw new Error("Cannot modify a closed case");
    }

    const target = this.disabilities.find((d) =>
      d.getStudentDisabilityId().equals(studentDisabilityId),
    );

    if (!target) {
      throw new Error("Disability not associated with case");
    }

    if (!target.isPrimaryDisability()) {
      throw new Error("Disability is not primary");
    }

    this.disabilities = this.disabilities.map((d) =>
      d.getStudentDisabilityId().equals(studentDisabilityId)
        ? d.removePrimary()
        : d,
    );

    this.domainEvents.push(
      new CasePrimaryDisabilityDemoted(
        this.caseId,
        studentDisabilityId,
        new Date(),
        actorId,
      ),
    );

    this.assertInvariants();
  }

  // Invariants
  private assertInvariants(): void {
    /*
     * -------------------------------------------------
     * Closed state metadata
     * -------------------------------------------------
     */
    if (this.state === CaseState.Closed) {
      if (!this.closedStatus || !this.closedAt || !this.closedBy) {
        throw new Error("Closed case must have close metadata");
      }
    } else {
      if (this.closedStatus || this.closedAt || this.closedBy) {
        throw new Error("Only closed cases can have close metadata");
      }
    }

    /*
     * -------------------------------------------------
     * Reopen metadata consistency
     * -------------------------------------------------
     */
    if (
      (this.reopenedAt && (!this.reopenedBy || !this.reopenedReason)) ||
      ((this.reopenedBy || this.reopenedReason) && !this.reopenedAt)
    ) {
      throw new Error("Reopen metadata must be all-or-nothing");
    }

    /*
     * -------------------------------------------------
     * Intake presence vs case state
     * -------------------------------------------------
     */
    if (this.state === CaseState.AdminCreated && this.intake) {
      throw new Error("Admin created cases cannot have an intake");
    }

    if (
      (this.state === CaseState.IntakeSubmitted ||
        this.state === CaseState.IntakeUnderReview) &&
      !this.intake
    ) {
      throw new Error("Intake states require an intake to exist");
    }

    /*
     * -------------------------------------------------
     * Case state ↔ Intake state synchronization
     * -------------------------------------------------
     */
    if (this.intake) {
      const intakeState = this.intake.getState();

      if (this.state === CaseState.IntakeSubmitted) {
        if (intakeState !== IntakeState.Submitted) {
          throw new Error("IntakeSubmitted case must have submitted intake");
        }
      }

      if (this.state === CaseState.IntakeUnderReview) {
        if (intakeState !== IntakeState.UnderReview) {
          throw new Error(
            "IntakeUnderReview case must have intake under review",
          );
        }
      }

      if (this.state === CaseState.ApprovedForAccommodations && this.intake) {
        if (intakeState !== IntakeState.Approved) {
          throw new Error(
            "Approved cases with intake must have approved intake",
          );
        }
      }

      if (this.closedStatus === ClosedStatus.DeniedIntake) {
        if (intakeState !== IntakeState.Denied) {
          throw new Error("Denied cases must have denied intake");
        }
      }

      if (this.closedStatus === ClosedStatus.Withdrawn) {
        if (intakeState !== IntakeState.Withdrawn) {
          throw new Error("Withdrawn cases must have withdrawn intake");
        }
      }

      if (this.closedStatus === ClosedStatus.Abandoned) {
        if (intakeState !== IntakeState.Abandoned) {
          throw new Error("Abandoned cases must have abandoned intake");
        }
      }
    }

    /*
     * -------------------------------------------------
     * Assignment invariants
     * -------------------------------------------------
     */
    const activeAssignments = this.assignments.filter((a) => a.isActive());

    const activePrimaryAssignments = activeAssignments.filter((a) =>
      a.isPrimary(),
    );

    if (activePrimaryAssignments.length > 1) {
      throw new Error("Only one primary admin allowed");
    }

    if (this.state !== CaseState.IntakeSubmitted) {
      if (activePrimaryAssignments.length !== 1) {
        throw new Error(
          "Case must have exactly one active primary admin unless intake submitted",
        );
      }
    }

    if (
      this.state === CaseState.IntakeSubmitted &&
      activeAssignments.length !== 0
    ) {
      throw new Error("IntakeSubmitted cases cannot have assigned admins");
    }

    const activeAssignmentPersonIds = activeAssignments.map((a) =>
      a.getPersonId().toString(),
    );

    if (
      new Set(activeAssignmentPersonIds).size !==
      activeAssignmentPersonIds.length
    ) {
      throw new Error("Case cannot have duplicate active assignments");
    }

    /*
     * -------------------------------------------------
     * Disability invariants
     * -------------------------------------------------
     */
    const disabilityIds = this.disabilities.map((d) =>
      d.getStudentDisabilityId().toString(),
    );

    if (new Set(disabilityIds).size !== disabilityIds.length) {
      throw new Error("Case cannot have duplicate disabilities");
    }

    //   const primaryDisabilities = this.disabilities.filter((d) =>
    //     d.isPrimaryDisability(),
    //   );

    //   if (primaryDisabilities.length > 1) {
    //     throw new Error("Only one primary disability allowed");
    //   }
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

  getStudentId(): PersonId {
    return this.studentId;
  }
}
