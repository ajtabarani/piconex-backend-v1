import { PersonId } from "@piconex/iam";
import { CaseId } from "../shared";
import { PinnedCase } from "./PinnedCase";

export interface PinnedCaseRepository {
  save(pinnedCase: PinnedCase): Promise<void>;
  delete(adminId: PersonId, caseId: CaseId): Promise<void>;

  findCaseIdsByAdminId(adminId: PersonId): Promise<CaseId[]>;
  exists(adminId: PersonId, caseId: CaseId): Promise<boolean>;
}
