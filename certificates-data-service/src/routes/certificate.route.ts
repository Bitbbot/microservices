import { Router } from "express";
import multer from "multer";

import certificatesController from "../controllers/certificate.controller.js";
import certificateValidation from "../middlewares/validation/certificate.validation.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const upload = multer({ dest: "./public" });
const router = Router();

router.post(
  "/",
  authMiddleware,
  upload.array("files"),
  certificateValidation.add,
  certificatesController.add
);
router.delete(
  "/",
  authMiddleware,
  certificateValidation.delete,
  certificatesController.delete
);
router.get(
  "/getAllNames",
  authMiddleware,
  certificateValidation.getAllNames,
  certificatesController.getAllNames
);
router.get("/:id", certificatesController.getFile);

export default router;
