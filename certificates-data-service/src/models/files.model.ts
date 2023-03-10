import * as mongoose from "mongoose";
import { Model } from "mongoose";

type FileType = FileModel & mongoose.Document;

export interface FileModel {
  fileId: String;
  fileName: String;
  supplierId: String;
}

const FilesSchema = new mongoose.Schema({
  fileId: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  supplierId: {
    type: String,
    required: true,
  },
});

const File: Model<FileType> = mongoose.model<FileType>("File", FilesSchema);
export default File;
