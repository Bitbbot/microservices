import { Router } from "express";
import multer from "multer";

import certificatesController from "../controllers/Certificate.controller.js";

const upload = multer({ dest: "./storage" });
const router = Router();

router.post(
  "/add",
  upload.array("files"),
  certificatesController.addCertificates
);
router.delete("/delete", certificatesController.deleteCertificates);
router.get("/getAllNames", certificatesController.getAllNames);
router.get("/getFile", certificatesController.getFile);

export default router;
