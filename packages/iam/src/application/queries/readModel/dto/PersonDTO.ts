import { Role } from "../../../../domain";

export type PersonDTO = {
  personId: string;
  externalAuthAccounts: {
    provider: string;
    externalAuthId: string;
  }[];
  universityId: string | null;

  firstName: string;
  preferredName: string | null;
  middleName: string | null;
  lastName: string;

  email: string;
  phoneNumber: string | null;

  pronouns: string | null;
  sex: string | null;
  gender: string | null;

  birthday: Date | null;

  roles: Role[];

  isActive: boolean;
  isSuperAdmin: boolean;

  createdAt: Date;
  updatedAt: Date;
};
