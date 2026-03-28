/**
 * Dev helper: prints every route registered on the IAM router (as mounted at /iam).
 *
 * Run from apps/backend: npx tsx src/http/routes/iam/listIamRoutes.ts
 */
import { Router } from "express";
import type { IAM } from "../../../bootstrap";
import { registerIamRouter } from "./registerIAMRoutes";

const mount = "/iam";

function printStack(router: Router, prefix: string): void {
  for (const layer of router.stack) {
    const route = layer.route as { path: string; methods: Record<string, boolean> } | undefined;
    if (!route?.path) continue;

    const methodsObj = route.methods;
    const methods = Object.keys(methodsObj).filter(
      (m) => m !== "_all" && methodsObj[m],
    );

    for (const m of methods) {
      console.log(`${m.toUpperCase().padEnd(7)} ${prefix}${route.path}`);
    }
  }
}

const r = Router();
registerIamRouter(r, {} as IAM);

console.log(`IAM routes (mounted at ${mount} in main app):\n`);
printStack(r, mount);
