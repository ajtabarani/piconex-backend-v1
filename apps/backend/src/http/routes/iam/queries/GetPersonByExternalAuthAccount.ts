import { Request, Response, Router } from "express";
import { z } from "zod";
import {
  AuthProvider,
  ExternalAuthId,
  type GetPersonByExternalAuthAccountRequest,
} from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";

const querySchema = z.object({
  provider: z.nativeEnum(AuthProvider),
  externalAuthId: z
    .string()
    .min(1, "externalAuthId is required"),
});

type Query = z.infer<typeof querySchema>;

function queryMapper(
  query: Query,
): Omit<GetPersonByExternalAuthAccountRequest, "actor"> {
  return {
    provider: query.provider,
    externalAuthId: ExternalAuthId.create(query.externalAuthId),
  };
}

export function registerRouteGetPersonByExternalAuthAccount(
  router: Router,
  iam: IAM,
) {
  router.get(
    "/person/by-external-auth",
    async (req: Request, res: Response) => {
      const query = parseZod(querySchema, req.query);

      const request: GetPersonByExternalAuthAccountRequest = {
        actor: req.actor,
        ...queryMapper(query),
      };
      const result = await iam.queries.getPersonByExternalAuthId.execute(
        request,
      );

      res.json(result);
    },
  );
}
