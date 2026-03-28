import { Request, Response, Router } from "express";
import { z } from "zod";
import { PersonId, type UpdateEmailRequest } from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import { personIdParamsSchema } from "../shared/iamHttpSchemas";

const bodySchema = z.object({
  email: z.string().min(1, "email is required").email("email must be valid"),
});

export function registerRouteUpdateEmail(router: Router, iam: IAM) {
  router.patch(
    "/person/:personId/email",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);
      const body = parseZod(bodySchema, req.body);

      const request: UpdateEmailRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
        email: body.email,
      };

      await iam.requests.updateEmail.execute(request);
      res.status(204).send();
    },
  );
}
