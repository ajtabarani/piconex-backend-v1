import { Request, Response, Router } from "express";
import {
  PersonId,
  type DeactivateStudentRoleRequest,
} from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import { personIdParamsSchema } from "../shared/iamHttpSchemas";

export function registerRouteDeactivateStudentRole(router: Router, iam: IAM) {
  router.post(
    "/person/:personId/roles/student/deactivate",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);

      const request: DeactivateStudentRoleRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
      };

      await iam.requests.deactivateStudentRole.execute(request);
      res.status(204).send();
    },
  );
}
