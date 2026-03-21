import {
  AdminProfileDTO,
  FacultyProfileDTO,
  PersonDTO,
  StudentProfileDTO,
} from "./dto";
import { PersonId, ExternalAuthId, AuthProvider } from "../../../domain";
import { PersonAuthorizationSnapshot } from "../../policies";

export interface PersonReadRepository {
  findById(personId: PersonId): Promise<PersonDTO | null>;

  findByExternalAuthAccount(
    provider: AuthProvider,
    externalAuthId: ExternalAuthId,
  ): Promise<PersonDTO | null>;

  findAuthorizationSnapshot(
    personId: PersonId,
  ): Promise<PersonAuthorizationSnapshot | null>;

  findStudentProfile(personId: PersonId): Promise<StudentProfileDTO | null>;
  findFacultyProfile(personId: PersonId): Promise<FacultyProfileDTO | null>;
  findAdminProfile(personId: PersonId): Promise<AdminProfileDTO | null>;

  findSuperAdmin(): Promise<PersonDTO | null>;
}
