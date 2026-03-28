import { Request, Response, Router } from "express";
import { z } from "zod";
import {
  AuthProvider,
  ExternalAuthId,
  PersonId,
  type UnlinkExternalAuthAccountRequest,
} from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import { personIdParamsSchema } from "../shared/iamHttpSchemas";

const bodySchema = z.object({
  authProvider: z.nativeEnum(AuthProvider),
  externalAuthId: z.string().min(1, "externalAuthId is required"),
});

export function registerRouteUnlinkExternalAuthAccount(
  router: Router,
  iam: IAM,
) {
  router.post(
    "/person/:personId/external-auth/unlink",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);
      const body = parseZod(bodySchema, req.body);

      const request: UnlinkExternalAuthAccountRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
        authProvider: body.authProvider,
        externalAuthId: ExternalAuthId.create(body.externalAuthId),
      };

      await iam.requests.unlinkExternalAuthAccount.execute(request);
      res.status(204).send();
    },
  );
}
