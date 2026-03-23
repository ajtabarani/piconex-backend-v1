import { Pool } from "mysql2/promise";
import {
  Address,
  AdminProfile,
  AuthProvider,
  ExternalAuthAccount,
  ExternalAuthId,
  FacultyProfile,
  Person,
  PersonId,
  PersonRepository,
  PersonState,
  Role,
  StudentProfile,
} from "../../domain";

export class PersonRepositoryImpl implements PersonRepository {
  constructor(private readonly pool: Pool) {}

  async load(personId: PersonId): Promise<Person> {
    const person = await this.findById(personId);
    if (!person) {
      throw new Error(`Person with id ${personId} not found`);
    }
    return person;
  }

  async findById(personId: PersonId): Promise<Person | null> {
    const [rows] = await this.pool.query<any[]>(
      `SELECT * FROM iam_person WHERE person_id = ?`,
      [personId],
    );

    if (rows.length === 0) return null;

    return this.buildPersonAggregate(rows[0]);
  }

  async findByExternalAuthAccount(
    authProvider: AuthProvider,
    externalAuthId: ExternalAuthId,
  ): Promise<Person | null> {
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

    return this.buildPersonAggregate(rows[0]);
  }

  async loadSuperAdmin(): Promise<Person> {
    const [rows] = await this.pool.query<any[]>(
      `SELECT * FROM iam_person WHERE is_super_admin = 1 LIMIT 1`,
    );

    if (rows.length === 0) {
      throw new Error("Super admin not found");
    }

    return this.buildPersonAggregate(rows[0]);
  }

  async save(person: Person): Promise<void> {
    const conn = await this.pool.getConnection();

    try {
      await conn.beginTransaction();

      // --- iam_person ---
      await conn.query(
        `
        INSERT INTO iam_person (
          person_id, university_id, is_super_admin,
          first_name, preferred_name, middle_name, last_name,
          email, phone_number,
          pronouns, sex, gender,
          birthday,
          address_line1, address_line2, city, geographical_state, zip_code, country,
          state, created_at, updated_at, import_job_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          university_id = VALUES(university_id),
          is_super_admin = VALUES(is_super_admin),
          first_name = VALUES(first_name),
          preferred_name = VALUES(preferred_name),
          middle_name = VALUES(middle_name),
          last_name = VALUES(last_name),
          email = VALUES(email),
          phone_number = VALUES(phone_number),
          pronouns = VALUES(pronouns),
          sex = VALUES(sex),
          gender = VALUES(gender),
          birthday = VALUES(birthday),
          address_line1 = VALUES(address_line1),
          address_line2 = VALUES(address_line2),
          city = VALUES(city),
          geographical_state = VALUES(geographical_state),
          zip_code = VALUES(zip_code),
          country = VALUES(country),
          state = VALUES(state),
          updated_at = VALUES(updated_at),
          import_job_id = VALUES(import_job_id)
        `,
        [
          person.getPersonId(),
          person.getUniversityId(),
          person.isSystemSuperAdmin(),

          person.getFirstName(),
          person.getPreferredName(),
          person.getMiddleName(),
          person.getLastName(),

          person.getEmail(),
          person.getPhoneNumber(),

          person.getPronouns(),
          person.getSex(),
          person.getGender(),

          person.getBirthday(),

          person.getAddress()?.getAddressLine1(),
          person.getAddress()?.getAddressLine2(),
          person.getAddress()?.getCity(),
          person.getAddress()?.getGeographicalState(),
          person.getAddress()?.getZipCode(),
          person.getAddress()?.getCountry(),

          person.getState(),
          person.getCreatedAt(),
          person.getUpdatedAt(),
          person.getImportJobId(),
        ],
      );

      // --- Auth Accounts (UPSERT) ---

      const personId = person.getPersonId();

      const externalAuthAccounts = person.getExternalAuthAccounts?.();
      if (externalAuthAccounts && externalAuthAccounts.length > 0) {
        for (const account of externalAuthAccounts) {
          await conn.query(
            `
            INSERT IGNORE INTO iam_person_externalAuthAccount (
                external_auth_account_id,
                person_id,
                auth_provider,
                external_auth_id,
                linked_at
              ) VALUES (UUID(), ?, ?, ?, ?)
            `,
            [
              personId,
              account.getAuthProvider(),
              account.getExternalAuthId(),
              account.getLinkedAt(),
            ],
          );
        }
      }

      // --- Profiles (UPSERT) ---
      const adminProfile = person.getAdminProfile?.();
      if (adminProfile) {
        await conn.query(
          `
    INSERT INTO iam_person_adminProfile (
      person_id, job_title, department, specialization,
      state, state_changed_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      job_title = VALUES(job_title),
      department = VALUES(department),
      specialization = VALUES(specialization),
      state = VALUES(state),
      state_changed_at = VALUES(state_changed_at),
      updated_at = VALUES(updated_at)
    `,
          [
            personId,
            adminProfile.getJobTitle(),
            adminProfile.getDepartment(),
            adminProfile.getSpecialization(),
            adminProfile.getState(),
            adminProfile.getStateChangedAt(),
            adminProfile.getCreatedAt(),
            adminProfile.getUpdatedAt(),
          ],
        );
      }

      const studentProfile = person.getStudentProfile?.();
      if (studentProfile) {
        await conn.query(
          `
    INSERT INTO iam_person_studentProfile (
      person_id, university_program, academic_level, year_of_study,
      state, state_changed_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      university_program = VALUES(university_program),
      academic_level = VALUES(academic_level),
      year_of_study = VALUES(year_of_study),
      state = VALUES(state),
      state_changed_at = VALUES(state_changed_at),
      updated_at = VALUES(updated_at)
    `,
          [
            personId,
            studentProfile.getUniversityProgram(),
            studentProfile.getAcademicLevel(),
            studentProfile.getYearOfStudy(),
            studentProfile.getState(),
            studentProfile.getStateChangedAt(),
            studentProfile.getCreatedAt(),
            studentProfile.getUpdatedAt(),
          ],
        );
      }

      const facultyProfile = person.getFacultyProfile?.();
      if (facultyProfile) {
        await conn.query(
          `
    INSERT INTO iam_person_facultyProfile (
      person_id, department, title,
      state, state_changed_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      department = VALUES(department),
      title = VALUES(title),
      state = VALUES(state),
      state_changed_at = VALUES(state_changed_at),
      updated_at = VALUES(updated_at)
    `,
          [
            personId,
            facultyProfile.getDepartment(),
            facultyProfile.getTitle(),
            facultyProfile.getState(),
            facultyProfile.getStateChangedAt(),
            facultyProfile.getCreatedAt(),
            facultyProfile.getUpdatedAt(),
          ],
        );
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  // =========================
  // Private helpers
  // =========================

  private async buildPersonAggregate(row: any): Promise<Person> {
    const personId = row.person_id;

    // -- pull linked external auth accounts
    const [externalAuthAccounts] = await this.pool.query<any[]>(
      `SELECT * FROM iam_person_externalAuthAccount WHERE person_id = ?`,
      [personId],
    );

    // --- profiles ---
    const [adminRows] = await this.pool.query<any[]>(
      `SELECT * FROM iam_person_adminProfile WHERE person_id = ?`,
      [personId],
    );

    const [studentRows] = await this.pool.query<any[]>(
      `SELECT * FROM iam_person_studentProfile WHERE person_id = ?`,
      [personId],
    );

    const [facultyRows] = await this.pool.query<any[]>(
      `SELECT * FROM iam_person_facultyProfile WHERE person_id = ?`,
      [personId],
    );

    const adminProfile = adminRows[0]
      ? AdminProfile.restore(
          adminRows[0].job_title,
          adminRows[0].department,
          adminRows[0].specialization,
          adminRows[0].state,
          adminRows[0].state_changed_at,
          adminRows[0].created_at,
          adminRows[0].updated_at,
        )
      : undefined;

    const studentProfile = studentRows[0]
      ? StudentProfile.restore(
          studentRows[0].university_program,
          studentRows[0].academic_level,
          studentRows[0].year_of_study,
          studentRows[0].state,
          studentRows[0].state_changed_at,
          studentRows[0].created_at,
          studentRows[0].updated_at,
        )
      : undefined;

    const facultyProfile = facultyRows[0]
      ? FacultyProfile.restore(
          facultyRows[0].department,
          facultyRows[0].title,
          facultyRows[0].state,
          facultyRows[0].state_changed_at,
          facultyRows[0].created_at,
          facultyRows[0].updated_at,
        )
      : undefined;

    // --- roles derived ---
    const roles: Role[] = [];
    if (studentProfile && studentProfile.isActive()) roles.push(Role.Student);
    if (facultyProfile && facultyProfile.isActive()) roles.push(Role.Faculty);
    if (adminProfile && adminProfile.isActive()) roles.push(Role.Admin);

    // --- address ---
    const address: Address | null =
      row.address_line1 || row.city || row.zip_code
        ? new Address(
            row.address_line1,
            row.address_line2,
            row.city,
            row.geographical_state,
            row.zip_code,
            row.country,
          )
        : null;

    return Person.restore(
      row.person_id,
      externalAuthAccounts.map(
        (ea) =>
          new ExternalAuthAccount(
            ea.auth_provider,
            ea.external_auth_id,
            ea.linked_at,
          ),
      ),
      row.university_id,
      !!row.is_super_admin,

      row.first_name,
      row.preferred_name,
      row.middle_name,
      row.last_name,

      row.email,
      row.phone_number,

      row.pronouns,
      row.sex,
      row.gender,

      row.birthday,
      address,

      roles,
      row.state,

      row.created_at,
      row.updated_at,
      row.import_job_id,

      studentProfile,
      facultyProfile,
      adminProfile,
    );
  }
}
