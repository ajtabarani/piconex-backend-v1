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

export function registerIamRouter(router: Router, iam: IAM): void {
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
