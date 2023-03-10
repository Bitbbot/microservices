import { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    req.headers.login !== process.env.CERTIFICATE_DATA_SERVICE_LOGIN ||
    req.headers.password !== process.env.CERTIFICATE_DATA_SERVICE_PASSWORD
  )
    return res.status(400).json({ message: "auth" });
  next();
}
