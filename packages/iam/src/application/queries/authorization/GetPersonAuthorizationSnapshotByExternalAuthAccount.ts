import { PersonAuthorizationSnapshot } from "../../policies";
import { PersonReadRepository } from "../readModel";
import { ExternalAuthId, AuthProvider } from "../../../domain";

export interface GetPersonAuthorizationSnapshotByExternalAuthAccountRequest {
  authProvider: AuthProvider;
  externalAuthId: ExternalAuthId;
}

export class GetPersonAuthorizationSnapshotByExternalAuthAccount {
  constructor(private readonly repository: PersonReadRepository) {}

  async execute(
    request: GetPersonAuthorizationSnapshotByExternalAuthAccountRequest,
  ): Promise<PersonAuthorizationSnapshot | null> {
    return this.repository.findAuthorizationSnapshotByExternalAuthAccount(
      request.authProvider,
      request.externalAuthId,
    );
  }
}
