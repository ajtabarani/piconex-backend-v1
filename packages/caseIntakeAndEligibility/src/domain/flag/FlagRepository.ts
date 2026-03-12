import { FlagId } from "../shared";
import { Flag } from "./Flag";

export interface FlagRepository {
  load(id: FlagId): Promise<Flag>;
  save(thread: Flag): Promise<void>;
  findByName(name: string): Promise<Flag[]>;
}
