import { Request, Response, Router } from "express";
import { z } from "zod";
import { PersonId, type UpdateAdminProfileRequest } from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import { nullableStrOpt, personIdParamsSchema } from "../shared/iamHttpSchemas";

const bodySchema = z.object({
  jobTitle: nullableStrOpt,
  department: nullableStrOpt,
  specialization: nullableStrOpt,
});

export function registerRouteUpdateAdminProfile(router: Router, iam: IAM) {
  router.patch(
    "/person/:personId/profiles/admin",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);
      const body = parseZod(bodySchema, req.body);

      const request: UpdateAdminProfileRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
        jobTitle: body.jobTitle ?? null,
        department: body.department ?? null,
        specialization: body.specialization ?? null,
      };

      await iam.requests.updateAdminProfile.execute(request);
      res.status(204).send();
    },
  );
}
