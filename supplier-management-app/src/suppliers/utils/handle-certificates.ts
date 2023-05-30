import { Readable } from 'stream';

const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'svg', 'webp'];

export async function handleCertificates(certificates): Promise<any> {
  const promises = [];

  for (let i = 0; i < certificates.length; i++) {
    const certificate = certificates[i];
    const { createReadStream, filename } = await certificate;
    const fileExt = filename.split('.').pop();
    if (!allowedExtensions.includes(fileExt)) {
      return { status: 401, message: 'Wrong file extension' };
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        const fileBuffer = await readFileIntoBuffer(createReadStream());
        resolve({ file: fileBuffer, filename });
      } catch (error) {
        reject({ status: 500, message: 'Error occurred processing files' });
      }
    });
    promises.push(promise);
  }

  return Promise.all(promises);
}

function readFileIntoBuffer(readStream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    readStream.on('data', (chunk) => chunks.push(chunk));
    readStream.on('end', () => resolve(Buffer.concat(chunks)));
    readStream.on('error', (error) => reject(error));
  });
}
