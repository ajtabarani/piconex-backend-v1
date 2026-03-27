import express from "express";
import { HttpError } from "./authMiddleware";

export function errorHandler(
  err: unknown,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
) {
  if (err instanceof HttpError) {
    console.log(err.message);
    return res.status(err.statusCode).send(err.message);
  }

  if (err instanceof Error) {
    console.error(err.message);
  } else {
    console.error(err);
  }

  return res.status(500).send("Internal Server Error");
}
