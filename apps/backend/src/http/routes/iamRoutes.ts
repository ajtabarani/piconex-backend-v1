import { Request, Router, Express } from "express";
import { PersonId } from "@piconex/iam/composition";
import { bootstrapIAM } from "../../bootstrap";

type IAM = ReturnType<typeof bootstrapIAM>;

export function registerIAMRoutes(app: Express, iam: IAM) {
  const router = Router();

  // ───────────────
  // routes
  // ───────────────

  router.get(
    "/person/:personId",
    async (req: Request<{ personId: string }>, res) => {
      const result = await iam.queries.getPersonById.execute({
        actor: req.actor,
        personId: PersonId.create(req.params.personId),
      });

      res.json(result);
    },
  );

  router.post("/admins", async (req, res) => {
    await iam.requests.createAdmin.execute({
      actor: req.actor,
      ...req.body,
    });

    res.status(201).send();
  });

  app.use("/iam", router);
}
