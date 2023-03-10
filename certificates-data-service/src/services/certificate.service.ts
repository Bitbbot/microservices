import File, { FileModel } from "../models/files.model.js";

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
    for (let file of files) {
      await File.deleteOne({ fileId: file, supplierId });
    }
  }

  async getAllFiles(supplierId: string) {
    return File.find({ supplierId });
  }

  // async
}

export default new CertificateService();
