import { pool } from "./db";
import { Person, PersonId, PersonRepository } from "../../domain";

export class PersonRepositoryImpl implements PersonRepository {
    constructor(private readonly pool = pool) {}

    async findById(personId: PersonId): Promise<Person | null> {
        const [rows] = await this.pool.query(
            'SELECT * FROM iam_person WHERE person_id = ?',
            [personId]
        );
        if (!rows[0]) return null;
        return null;
    }
}