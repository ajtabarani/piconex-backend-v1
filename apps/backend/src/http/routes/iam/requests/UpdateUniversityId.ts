import { Request, Response, Router } from "express";
import { z } from "zod";
import {
  PersonId,
  UniversityId,
  type UpdateUniversityIdRequest,
} from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import { personIdParamsSchema, universityIdField } from "../shared/iamHttpSchemas";

const bodySchema = z.object({
  universityId: universityIdField,
});

export function registerRouteUpdateUniversityId(router: Router, iam: IAM) {
  router.patch(
    "/person/:personId/university-id",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);
      const body = parseZod(bodySchema, req.body);

      const request: UpdateUniversityIdRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
        universityId: UniversityId.create(body.universityId),
      };

      await iam.requests.updateUniversityId.execute(request);
      res.status(204).send();
    },
  );
}
