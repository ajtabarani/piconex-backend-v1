import { Request, Response, NextFunction } from "express";
import { AuthProvider, ExternalAuthId } from "@piconex/iam/composition";
import { bootstrapIAM } from "../../bootstrap";
import { JWTPayload } from "express-oauth2-jwt-bearer";

type IAM = ReturnType<typeof bootstrapIAM>;

export const authMiddleware = (iam: IAM) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.auth?.payload;
      if (!payload) {
        return res.status(401).send("Unauthorized");
      }

      const { authProvider, externalAuthId } = extractIdentity(payload);

      const actor =
        await iam.queries.getPersonAuthorizationSnapshotByExternalAuthAccount.execute(
          {
            authProvider,
            externalAuthId,
          },
        );

      if (!actor) {
        return res.status(401).send("Unauthorized");
      }

      req.actor = actor;

      next();
    } catch {
      return res.status(401).send("Unauthorized");
    }
  };
};

export function extractIdentity(payload: JWTPayload): {
  authProvider: AuthProvider;
  externalAuthId: ExternalAuthId;
} {
  if (!payload.sub) {
    throw new Error("Missing sub in token");
  }

  const [providerRaw, userId] = payload.sub.split("|");

  if (!providerRaw || !userId) {
    throw new Error("Invalid sub format");
  }

  let authProvider: AuthProvider;

  switch (providerRaw) {
    case "google-oauth2":
      authProvider = AuthProvider.Google;
      break;
    default:
      throw new Error(`Unsupported provider: ${providerRaw}`);
  }

  return {
    authProvider,
    externalAuthId: ExternalAuthId.create(userId),
  };
}
