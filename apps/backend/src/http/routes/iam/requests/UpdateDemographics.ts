import { Request, Response, Router } from "express";
import { z } from "zod";
import { PersonId, type UpdateDemographicsRequest } from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import { nullableStrOpt, personIdParamsSchema } from "../shared/iamHttpSchemas";

const bodySchema = z.object({
  pronouns: nullableStrOpt,
  sex: nullableStrOpt,
  gender: nullableStrOpt,
  birthday: z.coerce.date().nullable().optional(),
});

export function registerRouteUpdateDemographics(router: Router, iam: IAM) {
  router.patch(
    "/person/:personId/demographics",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);
      const body = parseZod(bodySchema, req.body);

      const request: UpdateDemographicsRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
        pronouns: body.pronouns ?? null,
        sex: body.sex ?? null,
        gender: body.gender ?? null,
        birthday: body.birthday ?? null,
      };

      await iam.requests.updateDemographics.execute(request);
      res.status(204).send();
    },
  );
}
