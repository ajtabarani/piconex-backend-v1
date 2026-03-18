import { Pool } from "mysql2";
import {
  PersonDTO,
  PersonAuthorizationSnapshot,
  StudentProfileDTO,
  FacultyProfileDTO,
  AdminProfileDTO,
  PersonReadRepository,
} from "../../application";
import { PersonId, ExternalAuthId } from "../../domain";

export class PersonReadRepositoryImpl implements PersonReadRepository {
  constructor(private readonly pool: Pool) {}

  async findById(personId: PersonId): Promise<PersonDTO | null>;

  async findByExternalAuthId(
    externalAuthId: ExternalAuthId,
  ): Promise<PersonDTO | null>;

  async findAuthorizationSnapshot(
    personId: PersonId,
  ): Promise<PersonAuthorizationSnapshot | null>;

  async findStudentProfile(
    personId: PersonId,
  ): Promise<StudentProfileDTO | null>;
  async findFacultyProfile(
    personId: PersonId,
  ): Promise<FacultyProfileDTO | null>;
  async findAdminProfile(personId: PersonId): Promise<AdminProfileDTO | null>;

  async findSuperAdmin(): Promise<PersonDTO | null>;
}
