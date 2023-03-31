import { Router } from "express";
import certificatesRouter from "./certificate.route.js";

const router = Router();

router.use("/certificate", certificatesRouter);

export default router;
