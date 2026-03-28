import { Request, Response, Router } from "express";
import { z } from "zod";
import {
  PersonId,
  type GetFacultyProfileRequest,
} from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";

const paramsSchema = z.object({
  personId: z.string().uuid({ message: "personId must be a valid UUID" }),
});

type Params = z.infer<typeof paramsSchema>;

function paramsMapper(
  params: Params,
): Omit<GetFacultyProfileRequest, "actor"> {
  return {
    personId: PersonId.create(params.personId),
  };
}

export function registerRouteGetFacultyProfile(router: Router, iam: IAM) {
  router.get(
    "/person/:personId/profiles/faculty",
    async (req: Request, res: Response) => {
      const params = parseZod(paramsSchema, req.params);

      const request: GetFacultyProfileRequest = {
        actor: req.actor,
        ...paramsMapper(params),
      };
      const result = await iam.queries.getFacultyProfile.execute(request);

      res.json(result);
    },
  );
}
