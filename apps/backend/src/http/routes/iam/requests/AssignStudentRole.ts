import { Request, Response, Router } from "express";
import { z } from "zod";
import { PersonId, type AssignStudentRoleRequest } from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import { nullableStrOpt, personIdParamsSchema } from "../shared/iamHttpSchemas";

const bodySchema = z.object({
  universityProgram: nullableStrOpt,
  academicLevel: nullableStrOpt,
  yearOfStudy: nullableStrOpt,
});

export function registerRouteAssignStudentRole(router: Router, iam: IAM) {
  router.post(
    "/person/:personId/roles/student",
    async (req: Request, res: Response) => {
      const params = parseZod(personIdParamsSchema, req.params);
      const body = parseZod(bodySchema, req.body);

      const request: AssignStudentRoleRequest = {
        actor: req.actor,
        personId: PersonId.create(params.personId),
        universityProgram: body.universityProgram ?? null,
        academicLevel: body.academicLevel ?? null,
        yearOfStudy: body.yearOfStudy ?? null,
      };

      await iam.requests.assignStudentRole.execute(request);
      res.status(204).send();
    },
  );
}
