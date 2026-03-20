import { CaseId } from "../shared";
import { Case } from "./Case";

export interface CaseRepository {
  load(id: CaseId): Promise<Case>;
  save(thread: Case): Promise<void>;
}
