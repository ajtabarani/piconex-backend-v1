import { randomUUID } from "node:crypto";
import { Request, Response, Router } from "express";
import { z } from "zod";
import {
  PersonId,
  UniversityId,
  type CreateStudentRequest,
} from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";
import {
  addressSchema,
  importJobIdField,
  mapAddressOrNull,
  mapImportJobId,
  universityIdField,
  nullableStrOpt,
} from "../shared/iamHttpSchemas";

const bodySchema = z.object({
  universityId: universityIdField,

  firstName: z.string().min(1, "firstName is required"),
  preferredName: nullableStrOpt,
  middleName: nullableStrOpt,
  lastName: z.string().min(1, "lastName is required"),

  email: z.string().min(1, "email is required").email("email must be valid"),
  phoneNumber: nullableStrOpt,

  pronouns: nullableStrOpt,
  sex: nullableStrOpt,
  gender: nullableStrOpt,
  birthday: z.coerce.date().nullable().optional(),

  address: addressSchema.nullable().optional(),

  universityProgram: nullableStrOpt,
  academicLevel: nullableStrOpt,
  yearOfStudy: nullableStrOpt,

  importJobId: importJobIdField,
});

type Body = z.infer<typeof bodySchema>;

function bodyMapper(body: Body): Omit<CreateStudentRequest, "actor" | "personId"> {
  return {
    universityId: UniversityId.create(body.universityId),
    firstName: body.firstName,
    preferredName: body.preferredName ?? null,
    middleName: body.middleName ?? null,
    lastName: body.lastName,
    email: body.email,
    phoneNumber: body.phoneNumber ?? null,
    pronouns: body.pronouns ?? null,
    sex: body.sex ?? null,
    gender: body.gender ?? null,
    birthday: body.birthday ?? null,
    address: mapAddressOrNull(body.address),
    universityProgram: body.universityProgram ?? null,
    academicLevel: body.academicLevel ?? null,
    yearOfStudy: body.yearOfStudy ?? null,
    importJobId: mapImportJobId(body.importJobId),
  };
}

export function registerRouteCreateStudent(router: Router, iam: IAM) {
  router.post("/student", async (req: Request, res: Response) => {
    const body = parseZod(bodySchema, req.body);

    const personId = PersonId.create(randomUUID());
    const request: CreateStudentRequest = {
      actor: req.actor,
      personId,
      ...bodyMapper(body),
    };

    await iam.requests.createStudent.execute(request);

    const id = personId.toString();
    res.status(201).location(`/iam/person/${id}`).json({ personId: id });
  });
}
