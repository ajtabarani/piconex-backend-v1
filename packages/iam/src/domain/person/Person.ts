import {
  Address,
  AdminProfile,
  ExternalAuthId,
  FacultyProfile,
  ImportJobId,
  PersonId,
  PersonState,
  Role,
  StudentProfile,
  UniversityId,
} from ".";
import {
  AdminProfileUpdated,
  AdminRoleAssigned,
  AdminRoleDeactivated,
  AdminRoleReactivated,
  ContactInformationUpdated,
  DemographicsUpdated,
  DomainEvent,
  EmailUpdated,
  ExternalAuthLinked,
  ExternalAuthUnlinked,
  FacultyProfileUpdated,
  FacultyRoleAssigned,
  FacultyRoleDeactivated,
  FacultyRoleReactivated,
  PersonActivated,
  PersonCreated,
  PersonDeactivated,
  PersonImported,
  StudentProfileUpdated,
  StudentRoleAssigned,
  StudentRoleDeactivated,
  StudentRoleReactivated,
  SuperAdminGranted,
  SuperAdminRevoked,
  UniversityUpdated,
} from "..";
import { AuthProvider, ExternalAuthAccount } from "./valueObjects";

export class Person {
  private roles: Set<Role>;

  private studentProfile?: StudentProfile;
  private adminProfile?: AdminProfile;
  private facultyProfile?: FacultyProfile;

  private constructor(
    private readonly personId: PersonId,
    private externalAuthAccounts: ExternalAuthAccount[],
    private universityId: UniversityId,
    private isSuperAdmin: boolean,

    private firstName: string,
    private preferredName: string | null,
    private middleName: string | null,
    private lastName: string,

    private email: string,
    private phoneNumber: string | null,

    private pronouns: string | null,
    private sex: string | null,
    private gender: string | null,

    private birthday: Date | null,

    private address: Address | null,

    roles: Role[],
    private state: PersonState,
    private stateChangedAt: Date,

    private readonly createdAt: Date,
    private updatedAt: Date | null,
    private importJobId: ImportJobId | null,

    private domainEvents: DomainEvent[] = [],
  ) {
    if (roles.length === 0) {
      throw new Error("Person must have at least one role");
    }

    if (!firstName || !lastName) {
      throw new Error("First and last name are required");
    }

    if (!email) {
      throw new Error("Email is required");
    }

    this.roles = new Set(roles);
  }

  // Factories
  static createImportedStudent(
    personId: PersonId,
    universityId: UniversityId,
    firstName: string,
    preferredName: string | null,
    middleName: string | null,
    lastName: string,
    email: string,
    phoneNumber: string | null,
    pronouns: string | null,
    sex: string | null,
    gender: string | null,
    birthday: Date | null,
    address: Address | null,
    universityProgram: string | null,
    academicLevel: string | null,
    yearOfStudy: string | null,
    importJobId: ImportJobId,
  ): Person {
    const now = new Date();

    const person = new Person(
      personId,
      [],
      universityId,
      false,
      firstName,
      preferredName,
      middleName,
      lastName,
      email,
      phoneNumber,
      pronouns,
      sex,
      gender,
      birthday,
      address,
      [Role.Student],
      PersonState.Active,
      now,
      now,
      null,
      importJobId,
    );

    person.studentProfile = StudentProfile.create(
      universityProgram,
      academicLevel,
      yearOfStudy,
    );

    person.addEvent(new PersonCreated(personId, [Role.Student], now));
    person.addEvent(new PersonImported(personId, importJobId, now));

    return person;
  }

  static createImportedFaculty(
    personId: PersonId,
    universityId: UniversityId,
    firstName: string,
    preferredName: string | null,
    middleName: string | null,
    lastName: string,
    email: string,
    phoneNumber: string | null,
    pronouns: string | null,
    sex: string | null,
    gender: string | null,
    birthday: Date | null,
    address: Address | null,
    department: string | null,
    title: string | null,
    importJobId: ImportJobId,
  ): Person {
    const now = new Date();

    const person = new Person(
      personId,
      [],
      universityId,
      false,
      firstName,
      preferredName,
      middleName,
      lastName,
      email,
      phoneNumber,
      pronouns,
      sex,
      gender,
      birthday,
      address,
      [Role.Faculty],
      PersonState.Active,
      now,
      now,
      null,
      importJobId,
    );

    person.facultyProfile = FacultyProfile.create(department, title);

    person.addEvent(new PersonCreated(personId, [Role.Faculty], now));
    person.addEvent(new PersonImported(personId, importJobId, now));

    return person;
  }

  static createAdmin(
    personId: PersonId,
    authProvider: AuthProvider,
    externalAuthId: ExternalAuthId,
    universityId: UniversityId,
    firstName: string,
    preferredName: string | null,
    middleName: string | null,
    lastName: string,
    email: string,
    phoneNumber: string | null,
    pronouns: string | null,
    sex: string | null,
    gender: string | null,
    birthday: Date | null,
    address: Address | null,
    jobTitle: string | null,
    department: string | null,
    specialization: string | null,
  ): Person {
    const now = new Date();

    const person = new Person(
      personId,
      [],
      universityId,
      false,
      firstName,
      preferredName,
      middleName,
      lastName,
      email,
      phoneNumber,
      pronouns,
      sex,
      gender,
      birthday,
      address,
      [Role.Admin],
      PersonState.Active,
      now,
      now,
      null,
      null,
    );

    person.adminProfile = AdminProfile.create(
      jobTitle,
      department,
      specialization,
    );

    person.externalAuthAccounts.push(
      new ExternalAuthAccount(authProvider, externalAuthId, now),
    );

    person.addEvent(new PersonCreated(personId, [Role.Admin], now));
    person.addEvent(
      new ExternalAuthLinked(personId, authProvider, externalAuthId, now),
    );

    return person;
  }

  static restore(
    personId: PersonId,
    externalAuthAccounts: ExternalAuthAccount[],
    universityId: UniversityId,
    isSuperAdmin: boolean,

    firstName: string,
    preferredName: string | null,
    middleName: string | null,
    lastName: string,

    email: string,
    phoneNumber: string | null,

    pronouns: string | null,
    sex: string | null,
    gender: string | null,

    birthday: Date | null,
    address: Address | null,

    roles: Role[],
    state: PersonState,
    stateChangedAt: Date,

    createdAt: Date,
    updatedAt: Date,
    importJobId: ImportJobId | null,

    studentProfile?: StudentProfile,
    facultyProfile?: FacultyProfile,
    adminProfile?: AdminProfile,
  ): Person {
    const person = new Person(
      personId,
      externalAuthAccounts,
      universityId,
      isSuperAdmin,
      firstName,
      preferredName,
      middleName,
      lastName,
      email,
      phoneNumber,
      pronouns,
      sex,
      gender,
      birthday,
      address,
      roles,
      state,
      stateChangedAt,
      createdAt,
      updatedAt,
      importJobId,
    );

    person.studentProfile = studentProfile;
    person.facultyProfile = facultyProfile;
    person.adminProfile = adminProfile;

    return person;
  }

  // Commands
  updateContactInformation(
    phoneNumber: string | null,
    address: Address | null,
  ): void {
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.updatedAt = new Date();

    this.addEvent(new ContactInformationUpdated(this.personId, new Date()));
  }

  updateDemographics(
    pronouns: string | null,
    sex: string | null,
    gender: string | null,
    birthday: Date | null,
  ): void {
    this.pronouns = pronouns;
    this.sex = sex;
    this.gender = gender;
    this.birthday = birthday;
    this.updatedAt = new Date();

    this.addEvent(new DemographicsUpdated(this.personId, new Date()));
  }

  updateEmail(email: string): void {
    if (!email) throw new Error("Email cannot be empty");

    this.email = email;
    this.updatedAt = new Date();

    this.addEvent(new EmailUpdated(this.personId, email, new Date()));
  }

  updateUniversityId(universityId: UniversityId): void {
    this.universityId = universityId;
    this.updatedAt = new Date();

    this.addEvent(
      new UniversityUpdated(this.personId, universityId, new Date()),
    );
  }

  deactivate(): void {
    const now = new Date();
    this.state = PersonState.Inactive;
    this.stateChangedAt = now;
    this.updatedAt = now;
    this.addEvent(new PersonDeactivated(this.personId, now));
  }

  activate(): void {
    const now = new Date();
    this.state = PersonState.Active;
    this.stateChangedAt = now;
    this.updatedAt = now;
    this.addEvent(new PersonActivated(this.personId, now));
  }

  linkExternalAuthAccount(
    authProvider: AuthProvider,
    externalAuthId: ExternalAuthId,
  ): void {
    if (
      this.externalAuthAccounts.some(
        (a) => a.getAuthProvider() === authProvider,
      )
    ) {
      throw new Error("Auth provider already linked");
    }

    const now = new Date();

    const account = new ExternalAuthAccount(authProvider, externalAuthId, now);

    this.externalAuthAccounts.push(account);

    this.updatedAt = now;

    this.addEvent(
      new ExternalAuthLinked(this.personId, authProvider, externalAuthId, now),
    );
  }

  unlinkExternalAuthAccount(
    authProvider: AuthProvider,
    externalAuthId: ExternalAuthId,
  ): void {
    const existing = this.externalAuthAccounts.find(
      (a) =>
        a.getAuthProvider() === authProvider &&
        a.getExternalAuthId() === externalAuthId,
    );

    if (!existing) {
      throw new Error("External auth account not linked");
    }

    this.externalAuthAccounts = this.externalAuthAccounts.filter(
      (a) =>
        !(
          a.getAuthProvider() === authProvider &&
          a.getExternalAuthId() === externalAuthId
        ),
    );

    const now = new Date();

    this.updatedAt = now;

    this.addEvent(
      new ExternalAuthUnlinked(
        this.personId,
        authProvider,
        externalAuthId,
        now,
      ),
    );
  }

  assignStudentRole(
    universityProgram: string | null,
    academicLevel: string | null,
    yearOfStudy: string | null,
  ): void {
    if (this.studentProfile) {
      throw new Error("Student profile already exists");
    }

    this.studentProfile = StudentProfile.create(
      universityProgram,
      academicLevel,
      yearOfStudy,
    );

    this.roles.add(Role.Student);
    this.updatedAt = new Date();
    this.addEvent(new StudentRoleAssigned(this.personId, new Date()));
  }

  deactivateStudentRole(): void {
    if (!this.studentProfile) throw new Error("Not a student");
    this.studentProfile.deactivate();
    this.updatedAt = new Date();
    this.addEvent(new StudentRoleDeactivated(this.personId, new Date()));
  }

  reactivateStudentRole(): void {
    if (!this.studentProfile) throw new Error("Not a student");
    this.studentProfile.activate();
    this.updatedAt = new Date();
    this.addEvent(new StudentRoleReactivated(this.personId, new Date()));
  }

  updateStudentProfile(
    universityProgram: string | null,
    academicLevel: string | null,
    yearOfStudy: string | null,
  ): void {
    if (!this.studentProfile) {
      throw new Error("Person is not a student");
    }

    this.studentProfile.updateAcademicInfo(
      universityProgram,
      academicLevel,
      yearOfStudy,
    );

    this.updatedAt = new Date();
    this.addEvent(new StudentProfileUpdated(this.personId, new Date()));
  }

  assignAdminRole(
    jobTitle: string | null,
    department: string | null,
    specialization: string | null,
  ): void {
    if (this.adminProfile) {
      throw new Error("Admin profile already exists");
    }

    this.adminProfile = AdminProfile.create(
      jobTitle,
      department,
      specialization,
    );

    this.roles.add(Role.Admin);
    this.updatedAt = new Date();
    this.addEvent(new AdminRoleAssigned(this.personId, new Date()));
  }

  deactivateAdminRole(): void {
    if (!this.adminProfile) throw new Error("Not a admin");
    this.adminProfile.deactivate();
    this.updatedAt = new Date();
    this.addEvent(new AdminRoleDeactivated(this.personId, new Date()));
  }

  reactivateAdminRole(): void {
    if (!this.adminProfile) throw new Error("Not a admin");
    this.adminProfile.activate();
    this.updatedAt = new Date();
    this.addEvent(new AdminRoleReactivated(this.personId, new Date()));
  }

  updateAdminProfile(
    jobTitle: string | null,
    department: string | null,
    specialization: string | null,
  ): void {
    if (!this.adminProfile) {
      throw new Error("Person is not an admin");
    }

    this.adminProfile.updateJobInfo(jobTitle, department, specialization);
    this.updatedAt = new Date();
    this.addEvent(new AdminProfileUpdated(this.personId, new Date()));
  }

  assignFacultyRole(department: string | null, title: string | null): void {
    if (this.facultyProfile) {
      throw new Error("Faculty profile already exists");
    }

    this.facultyProfile = FacultyProfile.create(department, title);

    this.roles.add(Role.Faculty);
    this.updatedAt = new Date();
    this.addEvent(new FacultyRoleAssigned(this.personId, new Date()));
  }

  deactivateFacultyRole(): void {
    if (!this.facultyProfile) throw new Error("Not a faculty");
    this.facultyProfile.deactivate();
    this.updatedAt = new Date();
    this.addEvent(new FacultyRoleDeactivated(this.personId, new Date()));
  }

  reactivateFacultyRole(): void {
    if (!this.facultyProfile) throw new Error("Not a faculty");
    this.facultyProfile.activate();
    this.updatedAt = new Date();
    this.addEvent(new FacultyRoleReactivated(this.personId, new Date()));
  }

  updateFacultyProfile(department: string | null, title: string | null): void {
    if (!this.facultyProfile) {
      throw new Error("Person is not faculty");
    }

    this.facultyProfile.updateProfessionalInfo(department, title);
    this.updatedAt = new Date();
    this.addEvent(new FacultyProfileUpdated(this.personId, new Date()));
  }

  makeSuperAdmin(): void {
    if (this.isSuperAdmin) return;

    this.isSuperAdmin = true;
    this.updatedAt = new Date();
    this.addEvent(new SuperAdminGranted(this.personId, new Date()));
  }

  revokeSuperAdmin(): void {
    if (!this.isSuperAdmin) return;

    this.isSuperAdmin = false;
    this.updatedAt = new Date();
    this.addEvent(new SuperAdminRevoked(this.personId, new Date()));
  }

  // Read Interfaces
  getPersonId(): PersonId {
    return this.personId;
  }

  getExternalAuthAccounts(): ExternalAuthAccount[] {
    return this.externalAuthAccounts;
  }

  getUniversityId(): UniversityId {
    return this.universityId;
  }

  isSystemSuperAdmin(): boolean {
    return this.isSuperAdmin;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getPreferredName(): string | null {
    return this.preferredName;
  }

  getMiddleName(): string | null {
    return this.middleName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getEmail(): string {
    return this.email;
  }

  getPhoneNumber(): string | null {
    return this.phoneNumber;
  }

  getPronouns(): string | null {
    return this.pronouns;
  }

  getSex(): string | null {
    return this.sex;
  }

  getGender(): string | null {
    return this.gender;
  }

  getBirthday(): Date | null {
    return this.birthday;
  }

  getAddress(): Address | null {
    return this.address;
  }

  getState(): PersonState {
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

  getImportJobId(): ImportJobId | null {
    return this.importJobId;
  }

  isActive(): boolean {
    return this.state === PersonState.Active;
  }

  hasRole(role: Role): boolean {
    return this.roles.has(role);
  }

  getStudentProfile(): StudentProfile | undefined {
    return this.studentProfile;
  }

  getAdminProfile(): AdminProfile | undefined {
    return this.adminProfile;
  }

  getFacultyProfile(): FacultyProfile | undefined {
    return this.facultyProfile;
  }

  // Domain Events
  pullDomainEvents(): DomainEvent[] {
    const events = this.domainEvents;
    this.domainEvents = [];
    return events;
  }

  private addEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }
}
