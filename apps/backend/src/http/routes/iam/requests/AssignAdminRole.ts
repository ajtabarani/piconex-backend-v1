import { Request, Response, Router } from "express";
import { z } from "zod";
import { PersonId, type AssignAdminRoleRequest } from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import { nullableStrOpt, personIdParamsSchema } from "../shared/iamHttpSchemas";

const bodySchema = z.object({
  jobTitle: nullableStrOpt,
  department: nullableStrOpt,
  specialization: nullableStrOpt,
});

export function registerRouteAssignAdminRole(router: Router, iam: IAM) {
  router.post(
    "/person/:personId/roles/admin",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);
      const body = parseZod(bodySchema, req.body);

      const request: AssignAdminRoleRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
        jobTitle: body.jobTitle ?? null,
        department: body.department ?? null,
        specialization: body.specialization ?? null,
      };

      await iam.requests.assignAdminRole.execute(request);
      res.status(204).send();
    },
  );
}
