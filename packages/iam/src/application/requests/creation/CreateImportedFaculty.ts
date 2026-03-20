import {
  PersonId,
  UniversityId,
  Address,
  PersonRepository,
  Person,
  ImportJobId,
} from "../../../domain";
import {
  PersonAuthorizationSnapshot,
  PersonPolicy,
  PolicyGuard,
} from "../../policies";

export interface CreateImportedFacultyRequest {
  actor: PersonAuthorizationSnapshot;

  personId: PersonId;
  universityId: UniversityId;

  firstName: string;
  preferredName: string | null;
  middleName: string | null;
  lastName: string;

  email: string;
  phoneNumber: string | null;

  pronouns: string | null;
  sex: string | null;
  gender: string | null;
  birthday: Date | null;

  address: Address | null;

  department: string | null;
  title: string | null;

  importJobId: ImportJobId;
}

export class CreateImportedFaculty {
  constructor(
    private readonly repository: PersonRepository,
    private readonly policy: PersonPolicy,
    private readonly guard: PolicyGuard,
  ) {}

  async execute(request: CreateImportedFacultyRequest): Promise<void> {
    this.guard.ensure(this.policy.hasAdministrativeAuthority(request.actor));

    const person = Person.createImportedFaculty(
      request.personId,
      request.universityId,
      request.firstName,
      request.preferredName,
      request.middleName,
      request.lastName,
      request.email,
      request.phoneNumber,
      request.pronouns,
      request.sex,
      request.gender,
      request.birthday,
      request.address,
      request.department,
      request.title,
      request.importJobId,
    );

    await this.repository.save(person);
  }
}
