import Joi from "joi";
import path from "path";

const allowedExtensions = [".pdf", ".jpeg", ".png", ".svg", ".webp"];

function addCertificateValidation(data: unknown) {
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
  return fileAndSuppliersSchema.validate(data);
}

export { addCertificateValidation };
