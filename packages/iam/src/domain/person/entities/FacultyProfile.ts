import { RoleState } from "..";

export class FacultyProfile {
  private state: RoleState;
  private stateChangedAt: Date;

  private createdAt: Date;
  private updatedAt: Date;

  private constructor(
    private department: string | null,
    private title: string | null,
    state: RoleState,
    stateChangedAt: Date,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.state = state;
    this.stateChangedAt = stateChangedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    department: string | null,
    title: string | null,
  ): FacultyProfile {
    const now = new Date();

    return new FacultyProfile(
      department,
      title,
      RoleState.Active,
      now,
      now,
      now,
    );
  }

  static restore(
    department: string | null,
    title: string | null,
    state: RoleState,
    stateChangedAt: Date,
    createdAt: Date,
    updatedAt: Date,
  ): FacultyProfile {
    return new FacultyProfile(
      department,
      title,
      state,
      stateChangedAt,
      createdAt,
      updatedAt,
    );
  }

  updateProfessionalInfo(
    department: string | null,
    title: string | null,
  ): void {
    this.department = department;
    this.title = title;
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

  // Read interfaces
  getDepartment(): string | null {
    return this.department;
  }

  getTitle(): string | null {
    return this.title;
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
