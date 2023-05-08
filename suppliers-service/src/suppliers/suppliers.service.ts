import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-request.dto';
const FormData = require('form-data');
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { GetSupplierDto } from './dto/get-request.dto';

@Injectable()
export class SuppliersService {
  async createSupplier(data: CreateSupplierDto): Promise<{
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

  async getSupplier(data: GetSupplierDto): Promise<any> {
    const suppRes = await axios
      .get(`${process.env.SUPPLIERS_DATA_SERVICE_URL}suppliers/${data.id}`, {
        headers: {
          login: process.env.SUPPLIERS_DATA_SERVICE_LOGIN,
          password: process.env.SUPPLIERS_DATA_SERVICE_PASSWORD,
        },
      })
      .then((response) => {
        return { ...response.data, error: false };
      })
      .catch((error) => {
        return { error: true };
      });
    if (suppRes.error === true) return {};

    const certRes = await axios.get(
      `${process.env.CERTIFICATE_DATA_SERVICE_URL}api/certificate/getAllNames?supplierId=${data.id}`,
      {
        headers: {
          login: process.env.CERTIFICATE_DATA_SERVICE_LOGIN,
          password: process.env.CERTIFICATE_DATA_SERVICE_PASSWORD,
        },
      },
    );
    suppRes.certificates = JSON.parse(certRes.data).map((cert) => {
      return { fileName: cert.fileName, fileId: cert.fileId };
    });
    return suppRes;
  }

  async getSuppliers() {
    const suppRes = await axios
      .get(`${process.env.SUPPLIERS_DATA_SERVICE_URL}suppliers/`, {
        headers: {
          login: process.env.SUPPLIERS_DATA_SERVICE_LOGIN,
          password: process.env.SUPPLIERS_DATA_SERVICE_PASSWORD,
        },
      })
      .then((response) => {
        return { data: response.data, error: false };
      })
      .catch((error) => {
        return { data: '', error: true };
      });

    if (suppRes.error === true) return {};
    const suppliers = suppRes.data.map((supplier) => {
      return {
        ...supplier,
        roles: supplier.roles.map((role) => {
          return role.role;
        }),
        sectors: supplier.sectors.map((sector) => {
          return sector.sector;
        }),
      };
    });

    async function getSuppliersWithCertificates(suppliers) {
      const promises = suppliers.map(async (supplier) => {
        const certificates = await axios.get(
          `${process.env.CERTIFICATE_DATA_SERVICE_URL}api/certificate/getAllNames?supplierId=${supplier.id}`,
          {
            headers: {
              login: process.env.CERTIFICATE_DATA_SERVICE_LOGIN,
              password: process.env.CERTIFICATE_DATA_SERVICE_PASSWORD,
            },
          },
        );
        return {
          certificates: JSON.parse(certificates.data).map((certificate) => {
            return {
              fileName: certificate.fileName,
              fileId: certificate.fileId,
            };
          }),
          ...supplier,
        };
      });
      return await Promise.all(promises);
    }
    const supps = await getSuppliersWithCertificates(suppliers);
    return { suppliers: supps };
  }
}
