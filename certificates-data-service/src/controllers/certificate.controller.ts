import { Request, Response } from "express";

import certificateService from "../services/certificate.service.js";
import CertificateService from "../services/certificate.service.js";

class CertificateController {
  async add(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];
      const supplierId = req.body.supplierId;

      await certificateService.create(supplierId, files);
      return res.status(200).send("success");
    } catch (error: unknown) {
      return res.status(500).json({ error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const files = req.body.files.map((el: { id: string }) => el.id);
      const supplierId = req.body.supplierId;

      await certificateService.delete(supplierId, files);
      return res.status(200).send("success");
    } catch (error: unknown) {
      return res.status(500).json({ error });
    }
  }
  async getAllNames(req: Request, res: Response) {
    try {
      const supplierId = req.body.supplierId;

      const files = await certificateService.getAllFiles(supplierId);
      const names = files.map((file) => {
        return { fileName: file.fileName, fileId: file.fileId };
      });

      return res.status(200).json(JSON.stringify(names));
    } catch (error: unknown) {
      return res.status(500).json({ error });
    }
  }
  async getFile(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (CertificateService.isFileExist(id))
        return res.status(200).download(`public/${id}`);
      return res.status(404).json("file not found");
    } catch (error: unknown) {
      return res.status(500).json({ error });
    }
  }
}

export default new CertificateController();
