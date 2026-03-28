import { Express, Router } from "express";
import type { IAM } from "../../../bootstrap";
import { registerRouteGetPersonById } from "./queries";

export function registerIAMRoutes(app: Express, iam: IAM) {
  const router = Router();

  registerRouteGetPersonById(router, iam);

  // router.post("/admins", async (req: Request, res) => {
  //   await iam.requests.createAdmin.execute({
  //     actor: req.actor,
  //     ...req.body,
  //   });

  //   res.status(201).send();
  // });

  app.use("/iam", router);
}
