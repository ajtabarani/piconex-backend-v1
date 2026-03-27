import { Request, Response, NextFunction } from "express";
import { AuthProvider, ExternalAuthId } from "@piconex/iam/composition";
import { bootstrapIAM } from "../../bootstrap";
import { JWTPayload } from "express-oauth2-jwt-bearer";

type IAM = ReturnType<typeof bootstrapIAM>;

export class HttpError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

export const authMiddleware = (iam: IAM) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const payload = req.auth?.payload;
    if (!payload) {
      throw new HttpError(401, "Missing JWT payload");
    }

    const email = extractEmail(payload);
    isEmailVerified(payload);
    const { authProvider, externalAuthId } = extractIdentity(payload);

    let actor = await getActorByExternalAuth(iam, authProvider, externalAuthId);

    if (!actor) {
      await linkExternalAuthAccountToExistingPerson({
        iam,
        authProvider,
        externalAuthId,
        email,
      });

      actor = await getActorByExternalAuth(iam, authProvider, externalAuthId);
      if (!actor) {
        throw new HttpError(401, "External account is not linked");
      }
    }

    req.actor = actor;
    return next();
  };
};

function getClaim(payload: JWTPayload, claimName: string): unknown {
  return payload[claimName];
}

export function extractEmail(payload: JWTPayload): string {
  const value = getClaim(payload, "https://accessify-backend/email");
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  throw new HttpError(401, "Invalid email claim");
}

export function isEmailVerified(payload: JWTPayload): boolean {
  const value = getClaim(payload, "https://accessify-backend/email_verified");
  if (typeof value !== "boolean") {
    throw new HttpError(401, "Invalid email_verified claim");
  }
  if (!value) {
    throw new HttpError(401, "Email is not verified");
  }
  return true;
}

export function extractIdentity(payload: JWTPayload): {
  authProvider: AuthProvider;
  externalAuthId: ExternalAuthId;
} {
  if (!payload.sub) {
    throw new HttpError(401, "Missing sub in token");
  }

  const [providerRaw, userId] = payload.sub.split("|");

  if (!providerRaw || !userId) {
    throw new HttpError(401, "Invalid sub format");
  }

  let authProvider: AuthProvider;

  switch (providerRaw) {
    case "google-oauth2":
      authProvider = AuthProvider.Google;
      break;
    default:
      throw new HttpError(401, `Unsupported provider: ${providerRaw}`);
  }

  return {
    authProvider,
    externalAuthId: ExternalAuthId.create(userId),
  };
}

async function linkExternalAuthAccountToExistingPerson(_: {
  iam: IAM;
  authProvider: AuthProvider;
  externalAuthId: ExternalAuthId;
  email: string;
}): Promise<void> {
  console.log("LINKING EXTERNAL AUTH ACCOUNT TO EXISTING PERSON");
}

async function getActorByExternalAuth(
  iam: IAM,
  authProvider: AuthProvider,
  externalAuthId: ExternalAuthId,
) {
  return iam.queries.getPersonAuthorizationSnapshotByExternalAuthAccount.execute(
    {
      authProvider,
      externalAuthId,
    },
  );
}
