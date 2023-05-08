import { createWriteStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs';

const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'svg', 'webp'];

export async function handleCertificates(certificates) {
  const promises = [];

  for (let i = 0; i < certificates.length; i++) {
    const certificate = certificates[i];
    const { createReadStream, filename } = await certificate;
    const fileExt = filename.split('.').pop();
    if (!allowedExtensions.includes(fileExt))
      return { status: 401, message: 'Wrong file extension' };

    const promise = new Promise((resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(join(process.cwd(), `/temp/${filename}`)))
        .on('finish', () => {
          const file = fs.readFileSync(
            join(process.cwd(), `/temp/${filename}`),
          );
          fs.unlinkSync(join(process.cwd(), `/temp/${filename}`));
          resolve({ file, filename });
        })
        .on('error', () => {
          reject({ status: 500, message: 'Error occurred saving files' });
        });
    });
    promises.push(promise);
  }

  return Promise.all(promises);
}
