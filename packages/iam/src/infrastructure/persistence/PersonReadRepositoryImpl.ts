import { Pool } from "mysql2/promise";
import {
  PersonDTO,
  PersonAuthorizationSnapshot,
  StudentProfileDTO,
  FacultyProfileDTO,
  AdminProfileDTO,
  PersonReadRepository,
} from "../../application";
import {
  PersonId,
  ExternalAuthId,
  Role,
  UniversityId,
  AuthProvider,
} from "../../domain";

export class PersonReadRepositoryImpl implements PersonReadRepository {
  constructor(private readonly pool: Pool) {}

  async findById(personId: PersonId): Promise<PersonDTO | null> {
    const [rows] = await this.pool.query<any[]>(
      `SELECT * FROM iam_person WHERE person_id = ?`,
      [personId],
    );

    if (rows.length === 0) return null;

    return this.buildPersonDTO(rows[0]);
  }

  async findByExternalAuthAccount(
    authProvider: AuthProvider,
    externalAuthId: ExternalAuthId,
  ): Promise<PersonDTO | null> {
    const [rows] = await this.pool.query<any[]>(
      `
    SELECT p.*
    FROM iam_person p
    JOIN iam_person_externalAuthAccount ea
      ON ea.person_id = p.person_id
    WHERE ea.auth_provider = ? AND ea.external_auth_id = ?
    `,
      [authProvider, externalAuthId],
    );

    if (rows.length === 0) return null;

    return this.buildPersonDTO(rows[0]);
  }

  async findSuperAdmin(): Promise<PersonDTO | null> {
    const [rows] = await this.pool.query<any[]>(
      `SELECT * FROM iam_person WHERE is_super_admin = 1 LIMIT 1`,
    );

    if (rows.length === 0) return null;

    return this.buildPersonDTO(rows[0]);
  }

  async findAuthorizationSnapshot(
    personId: PersonId,
  ): Promise<PersonAuthorizationSnapshot | null> {
    const person = await this.findById(personId);
    if (!person) return null;

    return {
      personId,
      universityId: UniversityId.create(person.universityId),
      isActive: person.isActive,
      isSuperAdmin: person.isSuperAdmin,
      activeRoles: person.roles,
    };
  }

  async findStudentProfile(
    personId: PersonId,
  ): Promise<StudentProfileDTO | null> {
    const [rows] = await this.pool.query<any[]>(
      `SELECT * FROM iam_person_studentProfile WHERE person_id = ?`,
      [personId],
    );

    if (rows.length === 0) return null;

    const row = rows[0];

    return {
      personId: row.person_id,
      universityProgram: row.university_program,
      academicLevel: row.academic_level,
      yearOfStudy: row.year_of_study,
      isActive: row.state === "Active",
      stateChangedAt: row.state_changed_at,
    };
  }

  async findFacultyProfile(
    personId: PersonId,
  ): Promise<FacultyProfileDTO | null> {
    const [rows] = await this.pool.query<any[]>(
      `SELECT * FROM iam_person_facultyProfile WHERE person_id = ?`,
      [personId],
    );

    if (rows.length === 0) return null;

    const row = rows[0];

    return {
      personId: row.person_id,
      department: row.department,
      title: row.title,
      isActive: row.state === "Active",
      stateChangedAt: row.state_changed_at,
    };
  }

  async findAdminProfile(personId: PersonId): Promise<AdminProfileDTO | null> {
    const [rows] = await this.pool.query<any[]>(
      `SELECT * FROM iam_person_adminProfile WHERE person_id = ?`,
      [personId],
    );

    if (rows.length === 0) return null;

    const row = rows[0];

    return {
      personId: row.person_id,
      jobTitle: row.job_title,
      department: row.department,
      specialization: row.specialization,
      isActive: row.state === "Active",
      stateChangedAt: row.state_changed_at,
    };
  }

  // =========================
  // Private helper
  // =========================

  private async buildPersonDTO(row: any): Promise<PersonDTO> {
    const personId = row.person_id;

    // -- pull linked external auth accounts
    const [externalAuthAccounts] = await this.pool.query<any[]>(
      `SELECT * FROM iam_person_externalAuthAccount WHERE person_id = ?`,
      [personId],
    );

    // --- derive roles from profiles (single query) ---
    const [roleRows] = await this.pool.query<any[]>(
      `
      SELECT
        EXISTS(SELECT 1 FROM iam_person_studentProfile WHERE person_id = ?) AS has_student,
        EXISTS(SELECT 1 FROM iam_person_facultyProfile WHERE person_id = ?) AS has_faculty,
        EXISTS(SELECT 1 FROM iam_person_adminProfile WHERE person_id = ?) AS has_admin
      `,
      [personId, personId, personId],
    );

    const roles: Role[] = [];

    const roleRow = roleRows[0];

    if (roleRow.has_student) roles.push(Role.Student);
    if (roleRow.has_faculty) roles.push(Role.Faculty);
    if (roleRow.has_admin) roles.push(Role.Admin);

    return {
      personId: row.person_id,
      externalAuthAccounts: externalAuthAccounts.map((ea) => ({
        authProvider: ea.auth_provider,
        externalAuthId: ea.external_auth_id,
      })),
      universityId: row.university_id,

      firstName: row.first_name,
      preferredName: row.preferred_name,
      middleName: row.middle_name,
      lastName: row.last_name,

      email: row.email,
      phoneNumber: row.phone_number,

      pronouns: row.pronouns,
      sex: row.sex,
      gender: row.gender,

      birthday: row.birthday,

      roles,

      isActive: row.state === "Active",
      isSuperAdmin: !!row.is_super_admin,

      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
