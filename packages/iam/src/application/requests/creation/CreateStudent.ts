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

export interface CreateStudentRequest {
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

  universityProgram: string | null;
  academicLevel: string | null;
  yearOfStudy: string | null;

  importJobId: ImportJobId | null;
}

export class CreateStudent {
  constructor(
    private readonly repository: PersonRepository,
    private readonly policy: PersonPolicy,
    private readonly guard: PolicyGuard,
  ) {}

  async execute(request: CreateStudentRequest): Promise<void> {
    this.guard.ensure(this.policy.hasAdministrativeAuthority(request.actor));

    const person = Person.createStudent(
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
      request.universityProgram,
      request.academicLevel,
      request.yearOfStudy,
      request.importJobId,
    );

    await this.repository.save(person);
  }
}
