import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
const FormData = require('form-data');
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { GetSupplierDto } from './dto/get-request.dto';
import { DeleteSupplierDto } from './dto/delete-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Result } from './interfaces/result.interface';

@Injectable()
export class SuppliersService {
  async createSupplier(data: CreateSupplierDto): Promise<Result> {
    try {
      const response = await axios.post(
        `${process.env.SUPPLIERS_DATA_SERVICE_URL}suppliers`,
        {
          id: data.id,
          name: data.name,
          country: data.country,
          vatNumber: String(data.vatNumber),
          roles: data.roles,
          sectors: data.sectors,
        },
        {
          headers: {
            traceId: uuidv4(),
            login: process.env.SUPPLIERS_DATA_SERVICE_LOGIN,
            password: process.env.SUPPLIERS_DATA_SERVICE_PASSWORD,
          },
        },
      );
      return { status: response.status, message: 'success' };
    } catch (error) {
      return {
        status: error.response.data.statusCode,
        message: error.response.data.message,
      };
    }
  }

  async createCertificates(data: CreateSupplierDto): Promise<any> {
    if (!(data?.certificates?.length > 0)) {
      return { status: 200, message: 'success' };
    }
    try {
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

      const response = await axios.post(
        `${process.env.CERTIFICATE_DATA_SERVICE_URL}api/certificate/`,
        form,
        {
          headers: {
            login: process.env.CERTIFICATE_DATA_SERVICE_LOGIN,
            password: process.env.CERTIFICATE_DATA_SERVICE_PASSWORD,
            ...form.getHeaders(),
          },
        },
      );
      return {
        status: response.status,
        message: 'success',
      };
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    }
  }

  async getSupplier(data: GetSupplierDto): Promise<any> {
    try {
      const suppRes = await axios.get(
        `${process.env.SUPPLIERS_DATA_SERVICE_URL}suppliers/${data.id}`,
        {
          headers: {
            login: process.env.SUPPLIERS_DATA_SERVICE_LOGIN,
            password: process.env.SUPPLIERS_DATA_SERVICE_PASSWORD,
          },
        },
      );
      const supplier = suppRes.data;

      const certRes = await axios.get(
        `${process.env.CERTIFICATE_DATA_SERVICE_URL}api/certificate/getAllNames?supplierId=${data.id}`,
        {
          headers: {
            login: process.env.CERTIFICATE_DATA_SERVICE_LOGIN,
            password: process.env.CERTIFICATE_DATA_SERVICE_PASSWORD,
          },
        },
      );

      supplier.certificates = JSON.parse(certRes.data).map((cert) => {
        return { fileName: cert.fileName, fileId: cert.fileId };
      });

      return supplier;
    } catch (error) {
      return {};
    }
  }

  async getSuppliers() {
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
              fileId: `${process.env.CERTIFICATE_DATA_SERVICE_URL}api/certificate/${certificate.fileId}`,
            };
          }),
          ...supplier,
        };
      });
      return await Promise.all(promises);
    }

    try {
      const response = await axios.get(
        `${process.env.SUPPLIERS_DATA_SERVICE_URL}suppliers/`,
        {
          headers: {
            login: process.env.SUPPLIERS_DATA_SERVICE_LOGIN,
            password: process.env.SUPPLIERS_DATA_SERVICE_PASSWORD,
          },
        },
      );
      const suppRes = { data: response.data, error: false };
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
      const supps = await getSuppliersWithCertificates(suppliers);
      return { suppliers: supps };
    } catch (error) {
      return {};
    }
  }

  async deleteSupplier(data: DeleteSupplierDto): Promise<Result> {
    try {
      await axios.delete(
        `${process.env.SUPPLIERS_DATA_SERVICE_URL}suppliers/${data.id}`,
        {
          headers: {
            traceId: uuidv4(),
            login: process.env.SUPPLIERS_DATA_SERVICE_LOGIN,
            password: process.env.SUPPLIERS_DATA_SERVICE_PASSWORD,
          },
        },
      );
      return { status: 200, message: 'success' };
    } catch (error) {
      return {
        status: error.response.data.statusCode as number,
        message: error.response.data.message as string,
      };
    }
  }

  async updateSupplier(data: UpdateSupplierDto) {
    try {
      await axios.patch(
        `${process.env.SUPPLIERS_DATA_SERVICE_URL}suppliers`,
        {
          id: data.id,
          name: data.name,
          country: data.country,
          vatNumber: String(data.vatNumber),
          roles: data.roles,
          sectors: data.sectors,
          deleteFiles: data.deleteCertificates,
        },
        {
          headers: {
            traceId: uuidv4(),
            login: process.env.SUPPLIERS_DATA_SERVICE_LOGIN,
            password: process.env.SUPPLIERS_DATA_SERVICE_PASSWORD,
          },
        },
      );
      const newData = {
        ...data,
        certificates: data.addCertificates,
        supplierId: data.id,
      };
      const res = await this.createCertificates(newData);
      if (res.status === 200) return { status: 200, message: 'success' };
      else throw new Error();
    } catch (error) {
      return { status: 400, message: 'BAD REQUEST' };
    }
  }
}
