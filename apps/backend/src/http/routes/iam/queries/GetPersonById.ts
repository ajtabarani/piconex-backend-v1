import { Request, Response, Router } from "express";
import { z } from "zod";
import { PersonId, type GetPersonByIdRequest } from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";

const paramsSchema = z.object({
  personId: z.string().uuid({ message: "personId must be a valid UUID" }),
});

type Params = z.infer<typeof paramsSchema>;

function paramsMapper(params: Params): Omit<GetPersonByIdRequest, "actor"> {
  return {
    personId: PersonId.create(params.personId),
  };
}

export function registerRouteGetPersonById(router: Router, iam: IAM) {
  router.get(
    "/person/:personId",
    async (req: Request, res: Response) => {
      const params = parseZod(paramsSchema, req.params);

      const request: GetPersonByIdRequest = {
        actor: req.actor,
        ...paramsMapper(params),
      };
      const result = await iam.queries.getPersonById.execute(request);

      res.json(result);
    },
  );
}
