import { ExternalAuthId } from "./valueObjects";

export type AuthProvider = "google" | "microsoft" | "keycloak" | "github";

export class ExternalAuthAccount {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly externalAuthId: ExternalAuthId,
    private readonly linkedAt: Date,
  ) {}

  getAuthProvider(): AuthProvider {
    return this.authProvider;
  }

  getExternalAuthId(): ExternalAuthId {
    return this.externalAuthId;
  }

  getLinkedAt(): Date {
    return this.linkedAt;
  }

  equals(other: ExternalAuthAccount): boolean {
    return (
      this.authProvider === other.authProvider &&
      this.externalAuthId === other.externalAuthId
    );
  }
}
