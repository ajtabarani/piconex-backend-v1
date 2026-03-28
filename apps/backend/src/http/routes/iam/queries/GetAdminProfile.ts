import { Request, Response, Router } from "express";
import { z } from "zod";
import { PersonId, type GetAdminProfileRequest } from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";

const paramsSchema = z.object({
  personId: z.string().uuid({ message: "personId must be a valid UUID" }),
});

type Params = z.infer<typeof paramsSchema>;

function paramsMapper(params: Params): Omit<GetAdminProfileRequest, "actor"> {
  return {
    personId: PersonId.create(params.personId),
  };
}

export function registerRouteGetAdminProfile(router: Router, iam: IAM) {
  router.get(
    "/person/:personId/profiles/admin",
    async (req: Request, res: Response) => {
      const params = parseZod(paramsSchema, req.params);

      const request: GetAdminProfileRequest = {
        actor: req.actor,
        ...paramsMapper(params),
      };
      const result = await iam.queries.getAdminProfile.execute(request);

      res.json(result);
    },
  );
}
