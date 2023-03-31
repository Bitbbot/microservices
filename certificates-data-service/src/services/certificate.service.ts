import File, { FileModel } from "../models/files.model.js";
import * as fs from "fs";

class CertificateService {
  async create(supplierId: string, files: Express.Multer.File[]) {
    for (let file of files) {
      const data: FileModel = {
        fileId: file.filename,
        fileName: file.originalname,
        supplierId,
      };
      await File.create(data);
    }
  }

  async delete(supplierId: string, files: string[]) {
    for (let id of files) {
      try {
        fs.unlinkSync(`public/${id}`);
      } finally {
        await File.deleteOne({ fileId: id, supplierId });
      }
    }
  }

  async getAllFiles(supplierId: string) {
    return File.find({ supplierId });
  }

  isFileExist(id: string) {
    return fs.existsSync(`public/${id}`);
  }
}

export default new CertificateService();
