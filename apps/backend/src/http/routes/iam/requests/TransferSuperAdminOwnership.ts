import { Request, Response, Router } from "express";
import { z } from "zod";
import { PersonId, type TransferSuperAdminOwnershipRequest } from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";

const bodySchema = z.object({
  newSuperAdminId: z
    .string()
    .uuid({ message: "newSuperAdminId must be a valid UUID" }),
});

export function registerRouteTransferSuperAdminOwnership(
  router: Router,
  iam: IAM,
) {
  router.post(
    "/super-admin/transfer",
    async (req: Request, res: Response) => {
      const body = parseZod(bodySchema, req.body);

      const request: TransferSuperAdminOwnershipRequest = {
        actor: req.actor,
        newSuperAdminId: PersonId.create(body.newSuperAdminId),
      };

      await iam.requests.transferSuperAdminOwnership.execute(request);
      res.status(204).send();
    },
  );
}
