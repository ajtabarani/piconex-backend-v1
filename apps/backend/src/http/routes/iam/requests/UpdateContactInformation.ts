import { Request, Response, Router } from "express";
import { z } from "zod";
import {
  PersonId,
  type UpdateContactInformationRequest,
} from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import {
  addressSchema,
  mapAddressOrNull,
  nullableStrOpt,
  personIdParamsSchema,
} from "../shared/iamHttpSchemas";

const bodySchema = z.object({
  phoneNumber: nullableStrOpt,
  address: addressSchema.nullable().optional(),
});

export function registerRouteUpdateContactInformation(router: Router, iam: IAM) {
  router.patch(
    "/person/:personId/contact",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);
      const body = parseZod(bodySchema, req.body);

      const request: UpdateContactInformationRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
        phoneNumber: body.phoneNumber ?? null,
        address: mapAddressOrNull(body.address),
      };

      await iam.requests.updateContactInformation.execute(request);
      res.status(204).send();
    },
  );
}
