import { RoleState } from "..";

export class AdminProfile {
  private state: RoleState;
  private stateChangedAt: Date;

  private createdAt: Date;
  private updatedAt: Date | null;

  private constructor(
    private jobTitle: string | null,
    private department: string | null,
    private specialization: string | null,
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
    jobTitle: string | null,
    department: string | null,
    specialization: string | null,
  ): AdminProfile {
    const now = new Date();

    return new AdminProfile(
      jobTitle,
      department,
      specialization,
      RoleState.Active,
      now,
      now,
      null,
    );
  }

  static restore(
    jobTitle: string | null,
    department: string | null,
    specialization: string | null,
    state: RoleState,
    stateChangedAt: Date,
    createdAt: Date,
    updatedAt: Date,
  ): AdminProfile {
    return new AdminProfile(
      jobTitle,
      department,
      specialization,
      state,
      stateChangedAt,
      createdAt,
      updatedAt,
    );
  }

  updateJobInfo(
    jobTitle: string | null,
    department: string | null,
    specialization: string | null,
  ): void {
    this.jobTitle = jobTitle;
    this.department = department;
    this.specialization = specialization;
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

  getJobTitle(): string | null {
    return this.jobTitle;
  }

  getDepartment(): string | null {
    return this.department;
  }

  getSpecialization(): string | null {
    return this.specialization;
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
