import { Request, Response, NextFunction } from "express";
import { AuthProvider, ExternalAuthId } from "@piconex/iam/composition";
import { bootstrapIAM } from "../../bootstrap/bootstrapIAM";

type IAM = ReturnType<typeof bootstrapIAM>;

export const authMiddleware = (iam: IAM) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).send("Unauthorized");
      }

      const token = authHeader.slice("Bearer ".length);

      const decoded = decodeJwt(token);

      const { authProvider, externalAuthId } = extractIdentity(decoded);

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

function decodeJwt(token: string): unknown {
  const payload = token.split(".")[1];
  if (!payload) throw new Error("Invalid token");

  return JSON.parse(Buffer.from(payload, "base64").toString());
}

function extractIdentity(decoded: any): {
  authProvider: AuthProvider;
  externalAuthId: ExternalAuthId;
} {
  throw new Error("extractIdentity not implemented");
}
