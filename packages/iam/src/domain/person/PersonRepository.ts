import { Person } from "./Person";
import { PersonId, ExternalAuthId } from "./valueObjects";

export interface PersonRepository {
  load(id: PersonId): void;
  findById(personId: PersonId): Promise<Person | null>;
  findByExternalAuthId(externalAuthId: ExternalAuthId): Promise<Person | null>;
  loadSuperAdmin(): Promise<Person>;
  save(thread: Person): Promise<void>;
}
