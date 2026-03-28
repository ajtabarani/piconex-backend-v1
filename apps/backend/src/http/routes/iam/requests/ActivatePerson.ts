import { Request, Response, Router } from "express";
import { PersonId, type ActivatePersonRequest } from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import { personIdParamsSchema } from "../shared/iamHttpSchemas";

export function registerRouteActivatePerson(router: Router, iam: IAM) {
  router.post(
    "/person/:personId/activate",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);

      const request: ActivatePersonRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
      };

      await iam.requests.activatePerson.execute(request);
      res.status(204).send();
    },
  );
}
