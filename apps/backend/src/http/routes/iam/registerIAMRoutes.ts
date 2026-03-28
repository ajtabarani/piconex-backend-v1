import { Express, Router } from "express";
import type { IAM } from "../../../bootstrap";
import {
  registerRouteCheckPersonHasRole,
  registerRouteCheckPersonIsActive,
  registerRouteGetAdminProfile,
  registerRouteGetFacultyProfile,
  registerRouteGetPersonAuthorizationSnapshot,
  registerRouteGetPersonAuthorizationSnapshotByExternalAuthAccount,
  registerRouteGetPersonByExternalAuthAccount,
  registerRouteGetPersonById,
  registerRouteGetStudentProfile,
  registerRouteGetSuperAdmin,
} from "./queries";
import {
  registerRouteActivatePerson,
  registerRouteAssignAdminRole,
  registerRouteAssignFacultyRole,
  registerRouteAssignStudentRole,
  registerRouteCreateAdmin,
  registerRouteCreateFaculty,
  registerRouteCreateStudent,
  registerRouteDeactivateAdminRole,
  registerRouteDeactivateFacultyRole,
  registerRouteDeactivatePerson,
  registerRouteDeactivateStudentRole,
  registerRouteReactivateAdminRole,
  registerRouteReactivateFacultyRole,
  registerRouteReactivateStudentRole,
  registerRouteTransferSuperAdminOwnership,
  registerRouteUnlinkExternalAuthAccount,
  registerRouteUpdateAdminProfile,
  registerRouteUpdateContactInformation,
  registerRouteUpdateDemographics,
  registerRouteUpdateEmail,
  registerRouteUpdateFacultyProfile,
  registerRouteUpdateStudentProfile,
  registerRouteUpdateUniversityId,
} from "./requests";

export function registerIamRouter(router: Router, iam: IAM): void {
  registerRouteCreateAdmin(router, iam);
  registerRouteCreateFaculty(router, iam);
  registerRouteCreateStudent(router, iam);
  registerRouteTransferSuperAdminOwnership(router, iam);

  registerRouteUpdateAdminProfile(router, iam);
  registerRouteUpdateFacultyProfile(router, iam);
  registerRouteUpdateStudentProfile(router, iam);
  registerRouteUpdateContactInformation(router, iam);
  registerRouteUpdateDemographics(router, iam);
  registerRouteUpdateEmail(router, iam);
  registerRouteUpdateUniversityId(router, iam);
  registerRouteUnlinkExternalAuthAccount(router, iam);

  registerRouteActivatePerson(router, iam);
  registerRouteDeactivatePerson(router, iam);

  registerRouteDeactivateAdminRole(router, iam);
  registerRouteDeactivateFacultyRole(router, iam);
  registerRouteDeactivateStudentRole(router, iam);
  registerRouteReactivateAdminRole(router, iam);
  registerRouteReactivateFacultyRole(router, iam);
  registerRouteReactivateStudentRole(router, iam);
  registerRouteAssignAdminRole(router, iam);
  registerRouteAssignFacultyRole(router, iam);
  registerRouteAssignStudentRole(router, iam);

  registerRouteGetSuperAdmin(router, iam);
  registerRouteGetPersonByExternalAuthAccount(router, iam);
  registerRouteGetPersonAuthorizationSnapshotByExternalAuthAccount(router, iam);
  registerRouteCheckPersonHasRole(router, iam);
  registerRouteCheckPersonIsActive(router, iam);
  registerRouteGetPersonAuthorizationSnapshot(router, iam);
  registerRouteGetAdminProfile(router, iam);
  registerRouteGetStudentProfile(router, iam);
  registerRouteGetFacultyProfile(router, iam);
  registerRouteGetPersonById(router, iam);
}

export function registerIAMRoutes(app: Express, iam: IAM) {
  const router = Router();
  registerIamRouter(router, iam);
  app.use("/iam", router);
}
