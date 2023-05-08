import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import path from "path";

const allowedExtensions = [".pdf", ".jpeg", ".png", ".svg", ".webp", ".jpg"];

class CertificateValidation {
  add(req: Request, res: Response, next: NextFunction) {
    const files = req.files as Express.Multer.File[];
    const supplierId = req.body.supplierId;
    const data: {
      files: Express.Multer.File[];
      supplierId: string;
    } = { files, supplierId };

    const fileSchema = Joi.custom((value, helpers) => {
      const fileExt = path.extname(value.originalname);
      if (!allowedExtensions.includes(fileExt)) {
        return helpers.error("any.invalid");
      }
      return value;
    });

    const fileAndSuppliersSchema = Joi.object({
      supplierId: Joi.string().min(1).required(),
      files: Joi.array().min(1).items(fileSchema).required(),
    });

    const { error } = fileAndSuppliersSchema.validate(data);

    if (error) {
      return res.status(400).json({ message: "validation" });
    }
    next();
  }

  delete(req: Request, res: Response, next: NextFunction) {
    const files = req.body.files.map((el: { id: string }) => el.id);
    const supplierId = req.body.supplierId;

    const data: {
      files: string[];
      supplierId: string;
    } = { files, supplierId };

    const fileAndSuppliersSchema = Joi.object({
      supplierId: Joi.string().min(1).required(),
      files: Joi.array().items(Joi.string()).required(),
    });

    const { error } = fileAndSuppliersSchema.validate(data);
    if (error) {
      return res.status(400).json({ message: "validation" });
    }
    next();
  }

  getAllNames(req: Request, res: Response, next: NextFunction) {
    const supplierId = req.query.supplierId as string;

    const Schema = Joi.string().min(1).required();
    const { error } = Schema.validate(supplierId);

    if (error) {
      return res.status(400).json({ message: "validation" });
    }
    next();
  }
}

export default new CertificateValidation();
