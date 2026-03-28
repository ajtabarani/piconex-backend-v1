import { Request, Response, Router } from "express";
import {
  PersonId,
  type ReactivateFacultyRoleRequest,
} from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import { personIdParamsSchema } from "../shared/iamHttpSchemas";

export function registerRouteReactivateFacultyRole(router: Router, iam: IAM) {
  router.post(
    "/person/:personId/roles/faculty/reactivate",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);

      const request: ReactivateFacultyRoleRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
      };

      await iam.requests.reactivateFacultyRole.execute(request);
      res.status(204).send();
    },
  );
}
