import File, { FileModel } from "../models/Files.model.js";

class CertificateService {
  async createCertificate(supplierId: string, files: Express.Multer.File[]) {
    for (let file of files) {
      const data: FileModel = {
        fileId: file.filename,
        fileName: file.originalname,
        supplierId,
      };
      await File.create(data);
    }
  }
}

export default new CertificateService();
