import { Request, Response, Router } from "express";
import { PersonId, type DeactivatePersonRequest } from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import { personIdParamsSchema } from "../shared/iamHttpSchemas";

export function registerRouteDeactivatePerson(router: Router, iam: IAM) {
  router.post(
    "/person/:personId/deactivate",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);

      const request: DeactivatePersonRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
      };

      await iam.requests.deactivatePerson.execute(request);
      res.status(204).send();
    },
  );
}
