import { Person, PersonId, PersonRepository } from "../../domain";
import { Pool } from "mysql2";

export class PersonRepositoryImpl implements PersonRepository {
  constructor(private readonly pool: Pool) {}

  async findById(personId: PersonId): Promise<Person | null> {
    const rows = this.pool.query(
      "SELECT * FROM iam_person WHERE person_id = ?",
      [personId],
    );

    return rows;
  }
}
