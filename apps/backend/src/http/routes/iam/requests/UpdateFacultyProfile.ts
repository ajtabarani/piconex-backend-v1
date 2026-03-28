import { Request, Response, Router } from "express";
import { z } from "zod";
import {
  PersonId,
  type UpdateFacultyProfileRequest,
} from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import { nullableStrOpt, personIdParamsSchema } from "../shared/iamHttpSchemas";

const bodySchema = z.object({
  department: nullableStrOpt,
  title: nullableStrOpt,
});

export function registerRouteUpdateFacultyProfile(router: Router, iam: IAM) {
  router.patch(
    "/person/:personId/profiles/faculty",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);
      const body = parseZod(bodySchema, req.body);

      const request: UpdateFacultyProfileRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
        department: body.department ?? null,
        title: body.title ?? null,
      };

      await iam.requests.updateFacultyProfile.execute(request);
      res.status(204).send();
    },
  );
}
