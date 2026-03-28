import { randomUUID } from "node:crypto";
import { Request, Response, Router } from "express";
import { z } from "zod";
import {
  Address,
  ImportJobId,
  PersonId,
  UniversityId,
  type CreateAdminRequest,
} from "@piconex/iam/composition";
import type { IAM } from "../../../../bootstrap";
import { parseZod } from "../../../utils/parseZod";

const addressSchema = z.object({
  addressLine1: z.string(),
  addressLine2: z.string().nullable(),
  city: z.string(),
  geographicalState: z.string().nullable(),
  zipCode: z.string().nullable(),
  country: z.string(),
});

const bodySchema = z.object({
  universityId: z.string().trim().min(1, "universityId is required"),

  firstName: z.string().min(1, "firstName is required"),
  preferredName: z.string().nullable().optional(),
  middleName: z.string().nullable().optional(),
  lastName: z.string().min(1, "lastName is required"),

  email: z.string().min(1, "email is required").email("email must be valid"),
  phoneNumber: z.string().nullable().optional(),

  pronouns: z.string().nullable().optional(),
  sex: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  birthday: z.coerce.date().nullable().optional(),

  address: addressSchema.nullable().optional(),

  jobTitle: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  specialization: z.string().nullable().optional(),

  importJobId: z
    .union([
      z.string().uuid({ message: "importJobId must be a valid UUID" }),
      z.null(),
    ])
    .optional(),
});

type Body = z.infer<typeof bodySchema>;

function bodyMapper(body: Body): Omit<CreateAdminRequest, "actor" | "personId"> {
  const address =
    body.address === undefined || body.address === null
      ? null
      : new Address(
          body.address.addressLine1,
          body.address.addressLine2,
          body.address.city,
          body.address.geographicalState,
          body.address.zipCode,
          body.address.country,
        );

  const importJobId =
    body.importJobId === undefined || body.importJobId === null
      ? null
      : ImportJobId.create(body.importJobId);

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
    address,
    jobTitle: body.jobTitle ?? null,
    department: body.department ?? null,
    specialization: body.specialization ?? null,
    importJobId,
  };
}

export function registerRouteCreateAdmin(router: Router, iam: IAM) {
  router.post("/admin", async (req: Request, res: Response) => {
    const body = parseZod(bodySchema, req.body);

    const personId = PersonId.create(randomUUID());
    const request: CreateAdminRequest = {
      actor: req.actor,
      personId,
      ...bodyMapper(body),
    };

    await iam.requests.createAdmin.execute(request);

    const id = personId.toString();
    res.status(201).location(`/iam/person/${id}`).json({ personId: id });
  });
}
