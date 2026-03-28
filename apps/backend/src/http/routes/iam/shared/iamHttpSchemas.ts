import { z } from "zod";
import { Address, ImportJobId } from "@piconex/iam/composition";

export const personIdParamsSchema = z.object({
  personId: z.string().uuid({ message: "personId must be a valid UUID" }),
});

export const addressSchema = z.object({
  addressLine1: z.string(),
  addressLine2: z.string().nullable(),
  city: z.string(),
  geographicalState: z.string().nullable(),
  zipCode: z.string().nullable(),
  country: z.string(),
});

export function mapAddressOrNull(
  value: z.infer<typeof addressSchema> | null | undefined,
): Address | null {
  if (value === undefined || value === null) return null;
  return new Address(
    value.addressLine1,
    value.addressLine2,
    value.city,
    value.geographicalState,
    value.zipCode,
    value.country,
  );
}

export const importJobIdField = z
  .union([
    z.string().uuid({ message: "importJobId must be a valid UUID" }),
    z.null(),
  ])
  .optional();

export function mapImportJobId(
  v: string | null | undefined,
): ImportJobId | null {
  if (v === undefined || v === null) return null;
  return ImportJobId.create(v);
}

export const universityIdField = z
  .string()
  .trim()
  .min(1, "universityId is required");

export const nullableStrOpt = z.string().nullable().optional();
