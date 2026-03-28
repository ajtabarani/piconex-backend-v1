import type { ZodType } from "zod";
import { z } from "zod";
import { HttpError } from "../middleware";

export function parseZod<Schema extends ZodType>(
  schema: Schema,
  data: unknown,
): z.infer<Schema> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join("; ");
    throw new HttpError(400, message || "Invalid request");
  }
  return parsed.data;
}
