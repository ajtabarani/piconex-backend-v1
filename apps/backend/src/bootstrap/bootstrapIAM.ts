import { Pool } from "mysql2/promise";
import {
  PersonPolicy,
  PolicyGuard,
  GetPersonAuthorizationSnapshot,
  CheckPersonHasRole,
  CheckPersonIsActive,
  UpdateContactInformation,
  AuthorizationServiceImpl,
  PersonRepositoryImpl,
  PersonReadRepositoryImpl,
  GetPersonById,
  GetAdminProfile,
  GetStudentProfile,
  GetFacultyProfile,
  GetSuperAdmin,
  CreateAdmin,
  CreateImportedFaculty,
  CreateImportedStudent,
  UpdateAdminProfile,
  UpdateFacultyProfile,
  UpdateStudentProfile,
  UpdateDemographics,
  UpdateEmail,
  UpdateUniversityId,
  UnlinkExternalAuthAccount,
  ActivatePerson,
  DeactivatePerson,
  TransferSuperAdminOwnership,
  DeactivateAdminRole,
  DeactivateFacultyRole,
  DeactivateStudentRole,
  ReactivateAdminRole,
  ReactivateFacultyRole,
  ReactivateStudentRole,
  AssignAdminRole,
  AssignFacultyRole,
  AssignStudentRole,
  GetPersonByExternalAuthAccount,
  GetPersonAuthorizationSnapshotByExternalAuthAccount,
} from "@piconex/iam/composition";

export function bootstrapIAM(pool: Pool) {
  // ───────────────
  // infrastructure
  // ───────────────
  const personRepository = new PersonRepositoryImpl(pool);
  const personReadRepository = new PersonReadRepositoryImpl(pool);

  // ───────────────
  // policies / guards
  // ───────────────
  const personPolicy = new PersonPolicy();
  const policyGuard = new PolicyGuard();

  // ───────────────
  // queries
  // ───────────────
  const checkPersonHasRole = new CheckPersonHasRole(
    personReadRepository,
    personPolicy,
    policyGuard,
  );

  const checkPersonIsActive = new CheckPersonIsActive(
    personReadRepository,
    personPolicy,
    policyGuard,
  );

  const getPersonAuthorizationSnapshot = new GetPersonAuthorizationSnapshot(
    personReadRepository,
    personPolicy,
    policyGuard,
  );

  const getPersonAuthorizationSnapshotByExternalAuthAccount =
    new GetPersonAuthorizationSnapshotByExternalAuthAccount(
      personReadRepository,
    );

  const getPersonByExternalAuthId = new GetPersonByExternalAuthAccount(
    personReadRepository,
    personPolicy,
    policyGuard,
  );

  const getPersonById = new GetPersonById(
    personReadRepository,
    personPolicy,
    policyGuard,
  );

  const getAdminProfile = new GetAdminProfile(
    personReadRepository,
    personPolicy,
    policyGuard,
  );

  const getStudentProfile = new GetStudentProfile(
    personReadRepository,
    personPolicy,
    policyGuard,
  );

  const getFacultyProfile = new GetFacultyProfile(
    personReadRepository,
    personPolicy,
    policyGuard,
  );

  const getSuperAdmin = new GetSuperAdmin(
    personReadRepository,
    personPolicy,
    policyGuard,
  );

  // ───────────────
  // requests (use cases)
  // ───────────────
  const createAdmin = new CreateAdmin(
    personRepository,
    personPolicy,
    policyGuard,
  );

  const createImportedFaculty = new CreateImportedFaculty(
    personRepository,
    personPolicy,
    policyGuard,
  );

  const createImportedStudent = new CreateImportedStudent(
    personRepository,
    personPolicy,
    policyGuard,
  );

  const updateAdminProfile = new UpdateAdminProfile(
    personRepository,
    personPolicy,
    policyGuard,
  );

  const updateFacultyProfile = new UpdateFacultyProfile(
    personRepository,
    personPolicy,
    policyGuard,
  );

  const updateStudentProfile = new UpdateStudentProfile(
    personRepository,
    personReadRepository,
    personPolicy,
    policyGuard,
  );

  const updateContactInformation = new UpdateContactInformation(
    personRepository,
    personPolicy,
    policyGuard,
  );

  const updateDemographics = new UpdateDemographics(
    personRepository,
    personPolicy,
    policyGuard,
  );

  const updateEmail = new UpdateEmail(
    personRepository,
    personReadRepository,
    personPolicy,
    policyGuard,
  );

  const updateUniversityId = new UpdateUniversityId(
    personRepository,
    personReadRepository,
    personPolicy,
    policyGuard,
  );

  const unlinkExternalAuthAccount = new UnlinkExternalAuthAccount(
    personRepository,
    personPolicy,
    policyGuard,
  );

  const activatePerson = new ActivatePerson(
    personRepository,
    personReadRepository,
    personPolicy,
    policyGuard,
  );

  const deactivatePerson = new DeactivatePerson(
    personRepository,
    personReadRepository,
    personPolicy,
    policyGuard,
  );

  const transferSuperAdminOwnership = new TransferSuperAdminOwnership(
    personRepository,
    personPolicy,
    policyGuard,
  );

  const deactivateAdminRole = new DeactivateAdminRole(
    personRepository,
    personPolicy,
    policyGuard,
  );

  const deactivateFacultyRole = new DeactivateFacultyRole(
    personRepository,
    personPolicy,
    policyGuard,
  );

  const deactivateStudentRole = new DeactivateStudentRole(
    personRepository,
    personPolicy,
    policyGuard,
  );

  const reactivateAdminRole = new ReactivateAdminRole(
    personRepository,
    personPolicy,
    policyGuard,
  );

  const reactivateFacultyRole = new ReactivateFacultyRole(
    personRepository,
    personPolicy,
    policyGuard,
  );

  const reactivateStudentRole = new ReactivateStudentRole(
    personRepository,
    personPolicy,
    policyGuard,
  );

  const assignAdminRole = new AssignAdminRole(
    personRepository,
    personPolicy,
    policyGuard,
  );

  const assignFacultyRole = new AssignFacultyRole(
    personRepository,
    personPolicy,
    policyGuard,
  );

  const assignStudentRole = new AssignStudentRole(
    personRepository,
    personPolicy,
    policyGuard,
  );

  // ───────────────
  // services (facade)
  // ───────────────
  const authorizationService = new AuthorizationServiceImpl(
    checkPersonHasRole,
    checkPersonIsActive,
    getPersonAuthorizationSnapshot,
  );

  const queries = {
    checkPersonHasRole,
    checkPersonIsActive,
    getPersonAuthorizationSnapshot,
    getPersonAuthorizationSnapshotByExternalAuthAccount,
    getPersonByExternalAuthId,
    getPersonById,
    getAdminProfile,
    getStudentProfile,
    getFacultyProfile,
    getSuperAdmin,
  };

  const requests = {
    createAdmin,
    createImportedFaculty,
    createImportedStudent,
    updateAdminProfile,
    updateFacultyProfile,
    updateStudentProfile,
    updateContactInformation,
    updateDemographics,
    updateEmail,
    updateUniversityId,
    unlinkExternalAuthAccount,
    activatePerson,
    deactivatePerson,
    transferSuperAdminOwnership,
    deactivateAdminRole,
    deactivateFacultyRole,
    deactivateStudentRole,
    reactivateAdminRole,
    reactivateFacultyRole,
    reactivateStudentRole,
    assignAdminRole,
    assignFacultyRole,
    assignStudentRole,
  };

  const services = {
    authorizationService,
  };

  return {
    queries,
    requests,
    services,
  };
}
