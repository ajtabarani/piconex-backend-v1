import { Request, Response, Router } from "express";
import { PersonId, type DeactivateAdminRoleRequest } from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import { personIdParamsSchema } from "../shared/iamHttpSchemas";

export function registerRouteDeactivateAdminRole(router: Router, iam: IAM) {
  router.post(
    "/person/:personId/roles/admin/deactivate",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);

      const request: DeactivateAdminRoleRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
      };

      await iam.requests.deactivateAdminRole.execute(request);
      res.status(204).send();
    },
  );
}
