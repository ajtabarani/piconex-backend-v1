import { Request, Response, Router } from "express";
import { z } from "zod";
import {
  PersonId,
  Role,
  type CheckPersonHasRoleRequest,
} from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";

const paramsSchema = z.object({
  personId: z.string().uuid({ message: "personId must be a valid UUID" }),
  role: z.nativeEnum(Role),
});

type Params = z.infer<typeof paramsSchema>;

function paramsMapper(params: Params): Omit<CheckPersonHasRoleRequest, "actor"> {
  return {
    personId: PersonId.create(params.personId),
    role: params.role,
  };
}

export function registerRouteCheckPersonHasRole(router: Router, iam: IAM) {
  router.get(
    "/person/:personId/roles/:role",
    async (req: Request, res: Response) => {
      const params = parseZod(paramsSchema, req.params);

      const request: CheckPersonHasRoleRequest = {
        actor: req.actor,
        ...paramsMapper(params),
      };
      const result = await iam.queries.checkPersonHasRole.execute(request);

      res.json(result);
    },
  );
}
