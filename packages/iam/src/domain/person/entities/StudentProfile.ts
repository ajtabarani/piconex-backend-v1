import { RoleState } from "..";

export class StudentProfile {
  private state: RoleState;
  private stateChangedAt: Date;

  private createdAt: Date;
  private updatedAt: Date | null;

  private constructor(
    private universityProgram: string | null,
    private academicLevel: string | null,
    private yearOfStudy: string | null,
    state: RoleState,
    stateChangedAt: Date,
    createdAt: Date,
    updatedAt: Date | null,
  ) {
    this.state = state;
    this.stateChangedAt = stateChangedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    universityProgram: string | null,
    academicLevel: string | null,
    yearOfStudy: string | null,
  ): StudentProfile {
    const now = new Date();

    return new StudentProfile(
      universityProgram,
      academicLevel,
      yearOfStudy,
      RoleState.Active,
      now,
      now,
      null,
    );
  }

  static restore(
    universityProgram: string | null,
    academicLevel: string | null,
    yearOfStudy: string | null,
    state: RoleState,
    stateChangedAt: Date,
    createdAt: Date,
    updatedAt: Date,
  ): StudentProfile {
    return new StudentProfile(
      universityProgram,
      academicLevel,
      yearOfStudy,
      state,
      stateChangedAt,
      createdAt,
      updatedAt,
    );
  }

  updateAcademicInfo(
    universityProgram: string | null,
    academicLevel: string | null,
    yearOfStudy: string | null,
  ): void {
    this.universityProgram = universityProgram;
    this.academicLevel = academicLevel;
    this.yearOfStudy = yearOfStudy;
    this.updatedAt = new Date();
  }

  activate(): void {
    if (this.state === RoleState.Active) return;

    const now = new Date();
    this.state = RoleState.Active;
    this.stateChangedAt = now;
    this.updatedAt = now;
  }

  deactivate(): void {
    if (this.state === RoleState.Inactive) return;

    const now = new Date();
    this.state = RoleState.Inactive;
    this.stateChangedAt = now;
    this.updatedAt = now;
  }

  isActive(): boolean {
    return this.state === RoleState.Active;
  }

  getUniversityProgram(): string | null {
    return this.universityProgram;
  }

  getAcademicLevel(): string | null {
    return this.academicLevel;
  }

  getYearOfStudy(): string | null {
    return this.yearOfStudy;
  }

  getState(): RoleState {
    return this.state;
  }

  getStateChangedAt(): Date {
    return this.stateChangedAt;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date | null {
    return this.updatedAt;
  }
}
