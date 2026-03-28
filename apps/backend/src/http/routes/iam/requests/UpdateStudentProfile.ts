import { Request, Response, Router } from "express";
import { z } from "zod";
import {
  PersonId,
  type UpdateStudentProfileRequest,
} from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import { nullableStrOpt, personIdParamsSchema } from "../shared/iamHttpSchemas";

const bodySchema = z.object({
  universityProgram: nullableStrOpt,
  academicLevel: nullableStrOpt,
  yearOfStudy: nullableStrOpt,
});

export function registerRouteUpdateStudentProfile(router: Router, iam: IAM) {
  router.patch(
    "/person/:personId/profiles/student",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);
      const body = parseZod(bodySchema, req.body);

      const request: UpdateStudentProfileRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
        universityProgram: body.universityProgram ?? null,
        academicLevel: body.academicLevel ?? null,
        yearOfStudy: body.yearOfStudy ?? null,
      };

      await iam.requests.updateStudentProfile.execute(request);
      res.status(204).send();
    },
  );
}
