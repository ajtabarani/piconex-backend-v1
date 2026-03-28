import { Request, Response, Router } from "express";
import { z } from "zod";
import {
  AuthProvider,
  ExternalAuthId,
  type GetPersonAuthorizationSnapshotByExternalAuthAccountRequest,
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
): GetPersonAuthorizationSnapshotByExternalAuthAccountRequest {
  return {
    authProvider: query.provider,
    externalAuthId: ExternalAuthId.create(query.externalAuthId),
  };
}

export function registerRouteGetPersonAuthorizationSnapshotByExternalAuthAccount(
  router: Router,
  iam: IAM,
) {
  router.get(
    "/auth/external/authorization",
    async (req: Request, res: Response) => {
      const query = parseZod(querySchema, req.query);

      const request = queryMapper(query);
      const result =
        await iam.queries.getPersonAuthorizationSnapshotByExternalAuthAccount.execute(
          request,
        );

      res.json(result);
    },
  );
}
