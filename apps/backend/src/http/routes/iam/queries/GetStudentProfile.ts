import { Request, Response, Router } from "express";
import { z } from "zod";
import {
  PersonId,
  type GetStudentProfileRequest,
} from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";

const paramsSchema = z.object({
  personId: z.string().uuid({ message: "personId must be a valid UUID" }),
});

type Params = z.infer<typeof paramsSchema>;

function paramsMapper(
  params: Params,
): Omit<GetStudentProfileRequest, "actor"> {
  return {
    personId: PersonId.create(params.personId),
  };
}

export function registerRouteGetStudentProfile(router: Router, iam: IAM) {
  router.get(
    "/person/:personId/profiles/student",
    async (req: Request, res: Response) => {
      const params = parseZod(paramsSchema, req.params);

      const request: GetStudentProfileRequest = {
        actor: req.actor,
        ...paramsMapper(params),
      };
      const result = await iam.queries.getStudentProfile.execute(request);

      res.json(result);
    },
  );
}
