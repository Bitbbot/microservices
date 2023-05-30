import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
const FormData = require('form-data');
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { GetSupplierDto } from './dto/get-request.dto';
import { DeleteSupplierDto } from './dto/delete-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Result } from './interfaces/result.interface';
import { ConfigService } from '@nestjs/config';
import {
  mapCreateSupplierDtoToData,
  mapUpdateSupplierDtoToData,
} from './data.mappers';

@Injectable()
export class SuppliersService {
  private suppliersDataServiceUrl: string;
  private suppliersDataServiceLogin: string;
  private suppliersDataServicePassword: string;
  private certificateDataServiceUrl: string;
  private certificateDataServicePassword: string;
  private certificateDataServiceLogin: string;

  constructor(private configService: ConfigService) {
    this.suppliersDataServiceUrl = this.configService.get<string>(
      'SUPPLIERS_DATA_SERVICE_URL',
    );
    this.suppliersDataServiceLogin = this.configService.get<string>(
      'SUPPLIERS_DATA_SERVICE_LOGIN',
    );
    this.suppliersDataServicePassword = this.configService.get<string>(
      'SUPPLIERS_DATA_SERVICE_PASSWORD',
    );
    this.certificateDataServiceUrl = this.configService.get<string>(
      'CERTIFICATE_DATA_SERVICE_URL',
    );
    this.certificateDataServicePassword = this.configService.get<string>(
      'CERTIFICATE_DATA_SERVICE_PASSWORD',
    );
    this.certificateDataServiceLogin = this.configService.get<string>(
      'CERTIFICATE_DATA_SERVICE_LOGIN',
    );
  }

  async createSupplier(data: CreateSupplierDto): Promise<Result> {
    try {
      const mappedData = mapCreateSupplierDtoToData(data);

      const response = await axios.post(
        `${this.suppliersDataServiceUrl}suppliers`,
        mappedData,
        {
          headers: {
            traceId: uuidv4(),
            login: this.suppliersDataServiceLogin,
            password: this.suppliersDataServicePassword,
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
        `${this.certificateDataServiceUrl}api/certificate/`,
        form,
        {
          headers: {
            login: this.certificateDataServiceLogin,
            password: this.certificateDataServicePassword,
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
        `${this.suppliersDataServiceUrl}suppliers/${data.id}`,
        {
          headers: {
            login: this.suppliersDataServiceLogin,
            password: this.suppliersDataServicePassword,
          },
        },
      );
      const supplier = suppRes.data;

      const certRes = await axios.get(
        `${this.certificateDataServiceUrl}api/certificate/getAllNames?supplierId=${data.id}`,
        {
          headers: {
            login: this.certificateDataServiceLogin,
            password: this.certificateDataServicePassword,
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
    const certificateDataServiceUrl = this.certificateDataServiceUrl;
    const certificateDataServiceLogin = this.certificateDataServiceLogin;
    const certificateDataServicePassword = this.certificateDataServicePassword;

    async function getSuppliersWithCertificates(suppliers) {
      const promises = suppliers.map(async (supplier) => {
        const certificates = await axios.get(
          `${certificateDataServiceUrl}api/certificate/getAllNames?supplierId=${supplier.id}`,
          {
            headers: {
              login: certificateDataServiceLogin,
              password: certificateDataServicePassword,
            },
          },
        );
        return {
          certificates: JSON.parse(certificates.data).map((certificate) => {
            return {
              fileName: certificate.fileName,
              fileId: `${certificateDataServiceUrl}api/certificate/${certificate.fileId}`,
            };
          }),
          ...supplier,
        };
      });
      return await Promise.all(promises);
    }

    try {
      const response = await axios.get(
        `${this.suppliersDataServiceUrl}suppliers/`,
        {
          headers: {
            login: this.suppliersDataServiceLogin,
            password: this.suppliersDataServicePassword,
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
        `${this.suppliersDataServiceUrl}suppliers/${data.id}`,
        {
          headers: {
            traceId: uuidv4(),
            login: this.suppliersDataServiceLogin,
            password: this.suppliersDataServicePassword,
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
      const mappedData = mapUpdateSupplierDtoToData(data);

      await axios.patch(
        `${this.suppliersDataServiceUrl}suppliers`,
        mappedData,
        {
          headers: {
            traceId: uuidv4(),
            login: this.suppliersDataServiceLogin,
            password: this.suppliersDataServicePassword,
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
