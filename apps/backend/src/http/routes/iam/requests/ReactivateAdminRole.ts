import { Request, Response, Router } from "express";
import { PersonId, type ReactivateAdminRoleRequest } from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import { personIdParamsSchema } from "../shared/iamHttpSchemas";

export function registerRouteReactivateAdminRole(router: Router, iam: IAM) {
  router.post(
    "/person/:personId/roles/admin/reactivate",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);

      const request: ReactivateAdminRoleRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
      };

      await iam.requests.reactivateAdminRole.execute(request);
      res.status(204).send();
    },
  );
}
