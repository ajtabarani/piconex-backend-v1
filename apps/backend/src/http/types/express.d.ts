import { PersonAuthorizationSnapshot } from "@piconex/iam";

declare global {
  namespace Express {
    interface Request {
      actor: PersonAuthorizationSnapshot;
    }
  }
}
