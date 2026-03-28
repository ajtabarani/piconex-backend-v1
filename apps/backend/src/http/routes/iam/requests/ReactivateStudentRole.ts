import { Request, Response, Router } from "express";
import {
  PersonId,
  type ReactivateStudentRoleRequest,
} from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import { personIdParamsSchema } from "../shared/iamHttpSchemas";

export function registerRouteReactivateStudentRole(router: Router, iam: IAM) {
  router.post(
    "/person/:personId/roles/student/reactivate",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);

      const request: ReactivateStudentRoleRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
      };

      await iam.requests.reactivateStudentRole.execute(request);
      res.status(204).send();
    },
  );
}
