import { Request, Router, Express } from "express";
import { authMiddleware } from "../middleware/auth";
import { bootstrapIAM } from "../../bootstrap/bootstrapIAM";
import { PersonId } from "@piconex/iam/composition";

type IAM = ReturnType<typeof bootstrapIAM>;

export function registerIAMRoutes(app: Express, iam: IAM) {
  const router = Router();

  // inject only what middleware needs
  const auth = authMiddleware(iam);

  // ───────────────
  // routes
  // ───────────────

  router.get(
    "/person/:personId",
    auth,
    async (req: Request<{ personId: string }>, res) => {
      const result = await iam.queries.getPersonById.execute({
        actor: req.actor,
        personId: PersonId.create(req.params.personId),
      });

      res.json(result);
    },
  );

  router.post("/admins", auth, async (req, res) => {
    await iam.requests.createAdmin.execute({
      actor: req.actor,
      ...req.body,
    });

    res.status(201).send();
  });

  app.use("/iam", router);
}
