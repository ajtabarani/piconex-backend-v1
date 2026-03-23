import { Role, PersonId, UniversityId } from "../../domain";

export type PersonAuthorizationSnapshot = {
  personId: PersonId;
  universityId: UniversityId;

  isActive: boolean;
  isSuperAdmin: boolean;

  activeRoles: Role[];
};
