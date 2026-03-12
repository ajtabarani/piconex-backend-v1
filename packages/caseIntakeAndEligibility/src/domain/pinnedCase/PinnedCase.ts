import { PersonId } from "@piconex/iam";
import { CaseId } from "../shared";

export class PinnedCase {
  private readonly caseId: CaseId;
  private readonly adminId: PersonId;

  private readonly createdAt: Date;

  private constructor(caseId: CaseId, adminId: PersonId, createdAt: Date) {
    this.caseId = caseId;
    this.adminId = adminId;
    this.createdAt = createdAt;
  }

  // Factory
  static createNew(caseId: CaseId, adminId: PersonId): PinnedCase {
    return new PinnedCase(caseId, adminId, new Date());
  }

  // Read Interfaces
  getCaseId(): CaseId {
    return this.caseId;
  }

  getAdminId(): PersonId {
    return this.adminId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
