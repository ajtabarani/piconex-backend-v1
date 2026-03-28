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

export interface CreateAdminRequest {
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

  jobTitle: string | null;
  department: string | null;
  specialization: string | null;

  importJobId: ImportJobId | null;
}

export class CreateAdmin {
  constructor(
    private readonly repository: PersonRepository,
    private readonly policy: PersonPolicy,
    private readonly guard: PolicyGuard,
  ) {}

  async execute(request: CreateAdminRequest): Promise<void> {
    this.guard.ensure(this.policy.isSuperAdmin(request.actor));

    const person = Person.createAdmin(
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
      request.jobTitle,
      request.department,
      request.specialization,
      request.importJobId,
    );

    await this.repository.save(person);
  }
}
