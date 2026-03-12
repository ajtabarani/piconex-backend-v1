import { PersonId } from "@piconex/iam";
import { StudentDisabilityId } from "../../shared";

export class CaseDisability {
  private readonly studentDisabilityId: StudentDisabilityId;
  private readonly isPrimary: boolean;
  private readonly addedAt: Date;
  private readonly addedBy: PersonId;

  private constructor(
    studentDisabilityId: StudentDisabilityId,
    isPrimary: boolean,
    addedAt: Date,
    addedBy: PersonId,
  ) {
    this.studentDisabilityId = studentDisabilityId;
    this.isPrimary = isPrimary;
    this.addedAt = addedAt;
    this.addedBy = addedBy;
  }

  static createNew(
    studentDisabilityId: StudentDisabilityId,
    addedBy: PersonId,
  ): CaseDisability {
    return new CaseDisability(studentDisabilityId, false, new Date(), addedBy);
  }

  static restore(props: {
    studentDisabilityId: StudentDisabilityId;
    addedAt: Date;
    addedBy: PersonId;
    isPrimary: boolean;
  }): CaseDisability {
    return new CaseDisability(
      props.studentDisabilityId,
      props.isPrimary,

      props.addedAt,
      props.addedBy,
    );
  }

  makePrimary(): CaseDisability {
    return new CaseDisability(
      this.studentDisabilityId,
      true,
      this.addedAt,
      this.addedBy,
    );
  }

  removePrimary(): CaseDisability {
    return new CaseDisability(
      this.studentDisabilityId,
      false,
      this.addedAt,
      this.addedBy,
    );
  }

  isPrimaryDisability(): boolean {
    return this.isPrimary;
  }

  getStudentDisabilityId(): StudentDisabilityId {
    return this.studentDisabilityId;
  }

  getAddedAt(): Date {
    return this.addedAt;
  }

  getAddedBy(): PersonId {
    return this.addedBy;
  }
}
