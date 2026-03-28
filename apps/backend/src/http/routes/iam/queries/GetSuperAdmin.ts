import { Request, Response, Router } from "express";
import { type GetSuperAdminRequest } from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";

export function registerRouteGetSuperAdmin(router: Router, iam: IAM) {
  router.get("/super-admin", async (req: Request, res: Response) => {
    const request: GetSuperAdminRequest = {
      actor: req.actor,
    };
    const result = await iam.queries.getSuperAdmin.execute(request);

    res.json(result);
  });
}
