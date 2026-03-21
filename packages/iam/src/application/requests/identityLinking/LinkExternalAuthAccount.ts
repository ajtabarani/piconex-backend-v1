import {
  PersonId,
  ExternalAuthId,
  PersonRepository,
  AuthProvider,
} from "../../../domain";
import { PersonAuthorizationSnapshot } from "../../policies";

export interface LinkExternalAuthAccountRequest {
  actor: PersonAuthorizationSnapshot;
  personId: PersonId;
  authProvider: AuthProvider;
  externalAuthId: ExternalAuthId;
}

export class LinkExternalAuthAccount {
  constructor(private readonly repository: PersonRepository) {}

  async execute(request: LinkExternalAuthAccountRequest): Promise<void> {
    const existing = await this.repository.findByExternalAuthAccount(
      request.authProvider,
      request.externalAuthId,
    );

    if (existing) {
      throw new Error("External account already linked to another person");
    }

    const person = await this.repository.load(request.personId);

    person.linkExternalAuthAccount(
      request.authProvider,
      request.externalAuthId,
    );

    await this.repository.save(person);
  }
}
