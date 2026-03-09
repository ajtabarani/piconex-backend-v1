import { DisabilityId } from "../shared";
import Disability from "./Disability";

export interface CaseRepository {
  load(id: DisabilityId): Promise<Disability>;
  save(thread: Disability): Promise<void>;
}