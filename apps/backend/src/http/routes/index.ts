import { Express } from "express";
import { registerIAMRoutes } from "./iamRoutes";
import { bootstrapIAM } from "../../bootstrap/bootstrapIAM";

type IAM = ReturnType<typeof bootstrapIAM>;

export function registerRoutes(app: Express, deps: { iam: IAM }) {
  registerIAMRoutes(app, deps.iam);
}
