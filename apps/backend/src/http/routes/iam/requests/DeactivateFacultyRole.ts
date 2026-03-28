import { Request, Response, Router } from "express";
import {
  PersonId,
  type DeactivateFacultyRoleRequest,
} from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import { personIdParamsSchema } from "../shared/iamHttpSchemas";

export function registerRouteDeactivateFacultyRole(router: Router, iam: IAM) {
  router.post(
    "/person/:personId/roles/faculty/deactivate",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);

      const request: DeactivateFacultyRoleRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
      };

      await iam.requests.deactivateFacultyRole.execute(request);
      res.status(204).send();
    },
  );
}
