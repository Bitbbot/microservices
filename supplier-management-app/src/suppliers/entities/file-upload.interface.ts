import { Stream } from 'stream';

export interface FileUploadInterface {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}
