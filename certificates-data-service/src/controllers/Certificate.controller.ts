import { NextFunction, Request, Response } from "express";

import certificateService from "../services/Certificate.service.js";
import { addCertificateValidation } from "../validations/Certificate.validation.js";

class CertificateController {
  async addCertificates(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];
      const supplierId = req.body.supplierId;

      const { error } = addCertificateValidation({ files, supplierId });
      if (error) return res.status(400).json({ message: "error" });

      await certificateService.createCertificate(supplierId, files);

      return res.status(200).send("addCertificates");
    } catch (error: unknown) {
      return res.status(500).json({ error });
    }
  }
  async deleteCertificates(req: Request, res: Response, next: NextFunction) {
    // try {
    //   // if (
    //   //   !req.body.supplierId ||
    //   //   !req.body.files.length ||
    //   //   req.body.files.length === 0
    //   // )
    //   //   return res.status(400).send("Wrong parameters");
    //
    //   return res.status(200).send("deleteCertificates");
    // } catch (error: any) {
    //   return res.status(500).send({ error: error.message });
    // }
  }
  async getAllNames(req: Request, res: Response, next: NextFunction) {
    res.send("getAllNames");
  }
  async getFile(req: Request, res: Response, next: NextFunction) {
    res.send("getFile");
  }
}

export default new CertificateController();
