import File, { FileModel } from "../models/files.model.js";
import * as fs from "fs";

class CertificateService {
  async create(supplierId: string, files: Express.Multer.File[]) {
    const fileIds = [];
    for (let file of files) {
      const data: FileModel = {
        fileId: file.filename,
        fileName: file.originalname,
        supplierId,
      };
      fileIds.push(file.filename);
      await File.create(data);
    }
    return fileIds;
  }

  async delete(supplierId: string, files: string[]) {
    for (let id of files) {
      try {
        fs.unlinkSync(`public/${id}`);
      } catch (e) {
      } finally {
        await File.deleteOne({ fileId: id, supplierId });
      }
    }
  }

  async deleteBySupplierId(supplierId: string) {
    const files = await this.getAllFiles(supplierId);
    for (let id of files) {
      try {
        fs.unlinkSync(`public/${id}`);
      } catch (e) {}
    }
    await File.deleteMany({ supplierId });
  }

  async getAllFiles(supplierId: string) {
    return File.find({ supplierId });
  }

  isFileExist(id: string) {
    return fs.existsSync(`public/${id}`);
  }
}

export default new CertificateService();
