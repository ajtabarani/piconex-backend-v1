import { Request, Response, NextFunction } from "express";
import { bootstrapIAM } from "../../bootstrap/bootstrapIAM";
import { AuthProvider, ExternalAuthId } from "@piconex/iam/composition";

// extend Request type via your /types file
interface AuthedRequest extends Request {
  actor?: any;
}

export const authMiddleware = (iam: ReturnType<typeof bootstrapIAM>) => {
  return async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      // 1. Extract token
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).send("Unauthorized");
      }

      const token = authHeader.replace("Bearer ", "");

      // 2. Verify token (stub for now)
      const decoded = await verifyJwt(token);

      // 3. Extract identity
      const { authProvider, externalAuthId } = extractIdentity(decoded);

      // 4. Resolve actor from IAM
      const actor =
        await iam.queries.getPersonAuthorizationSnapshotByExternalAuthAccount.execute(
          {
            authProvider: AuthProvider(authProvider),
            externalAuthId: ExternalAuthId.create(externalAuthId),
          },
        );

      if (!actor) {
        return res.status(401).send("Unauthorized");
      }

      // 5. Attach to request
      req.actor = actor;

      next();
    } catch (e) {
      return res.status(401).send("Unauthorized");
    }
  };
};

function extractIdentity(decoded: any): {
  authProvider: string;
  externalAuthId: string;
} {
  // Example: "auth0|abc123"
  const sub: string = decoded.sub;

  if (!sub) throw new Error("Invalid token");

  const [authProvider, externalAuthId] = sub.split("|");

  if (!authProvider || !externalAuthId) {
    throw new Error("Invalid sub format");
  }

  return { authProvider, externalAuthId };
}
