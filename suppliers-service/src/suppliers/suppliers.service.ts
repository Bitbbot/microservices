import { Injectable } from '@nestjs/common';
import { SupplierRequest } from './interfaces/supplier-request.interface';
const FormData = require('form-data');
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SuppliersService {
  async createSupplier(data: SupplierRequest): Promise<{
    status: number;
    message: string;
  }> {
    let certRes = { status: 200, message: 'success', fileIds: [] };
    if (data?.certificates?.length > 0) {
      const form = new FormData();

      form.append('supplierId', data.id);
      if (data.certificates) {
        for (let certificate of data.certificates) {
          form.append('files', certificate.file, {
            filename: certificate.filename,
            contentType: 'application/octet-stream',
          });
        }
      }

      certRes = await axios
        .post(
          `${process.env.CERTIFICATE_DATA_SERVICE_URL}api/certificate/`,
          form,
          {
            headers: {
              login: process.env.CERTIFICATE_DATA_SERVICE_LOGIN,
              password: process.env.CERTIFICATE_DATA_SERVICE_PASSWORD,
              ...form.getHeaders(),
            },
          },
        )
        .then((response) => {
          return {
            status: response.status,
            message: 'success',
            fileIds: response.data.fileIds,
          };
        })
        .catch((error) => {
          return {
            status: error.response.status,
            message: error.response.data.message,
            fileIds: [],
          };
        });

      if (certRes.status !== 200) {
        return { status: certRes.status, message: certRes.message };
      }
    }
    const suppRes = await axios
      .post(
        `${process.env.SUPPLIERS_DATA_SERVICE_URL}suppliers`,
        {
          id: data.id,
          name: data.name,
          country: data.country,
          vatNumber: String(data.vatNumber),
          roles: data.roles,
          sectors: data.sectors,
          fileIds: certRes.fileIds,
        },
        {
          headers: {
            traceId: uuidv4(),
            login: process.env.SUPPLIERS_DATA_SERVICE_LOGIN,
            password: process.env.SUPPLIERS_DATA_SERVICE_PASSWORD,
          },
        },
      )
      .then((response) => {
        return { status: certRes.status, message: certRes.message };
      })
      .catch((error) => {
        return {
          status: error.response.data.statusCode,
          message: error.response.data.message,
        };
      });
    return { status: suppRes.status, message: suppRes.message };
  }

  async getSupplier(data: { id: string }): Promise<any> {}
}
