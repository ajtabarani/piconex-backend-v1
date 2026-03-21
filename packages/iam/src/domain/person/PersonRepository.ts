import { Person } from "./Person";
import { PersonId, ExternalAuthId, AuthProvider } from "./valueObjects";

export interface PersonRepository {
  load(personId: PersonId): Promise<Person>;
  findById(personId: PersonId): Promise<Person | null>;
  findByExternalAuthAccount(
    provider: AuthProvider,
    externalAuthId: ExternalAuthId,
  ): Promise<Person | null>;
  loadSuperAdmin(): Promise<Person>;
  save(thread: Person): Promise<void>;
}
