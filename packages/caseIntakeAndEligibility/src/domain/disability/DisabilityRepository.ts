import { DisabilityId } from "../shared";
import { Disability } from "./Disability";

export interface DisabilityRepository {
  load(id: DisabilityId): Promise<Disability>;
  save(thread: Disability): Promise<void>;
  findByName(name: string): Promise<Disability[]>;
}
