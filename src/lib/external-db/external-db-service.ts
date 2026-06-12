import { Transaction } from 'sequelize';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

import { Database } from './database/database';

export interface CreateWarrantyLineInput {
  productType: string;
  productSeries?: string;
  quantity?: number;
  installationDate: Date;
  serialNumber?: string;
}

export interface CreateWarrantyInput {
  firstName: string;
  lastName: string;
  email: string;
  telephone?: string;
  address1?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  agreeToNewsUpdates?: boolean;
  lines?: CreateWarrantyLineInput[];
}

export interface CreateWarrantyResult {
  success: boolean;
  headerId: string;
}

export interface EntFormLineInput {
  fieldId: string;
  fieldName: string;
  fieldType: string;
  fieldValue?: string | null;
}

export interface EntForm {
  formId: string;
  sessionId?: string;
  formName?: string | null;
  lines?: EntFormLineInput[];
}

export interface CreateOrUpdateEntFormResult {
  success: boolean;
  headerId: string;
  sessionId: string;
  formId: string;
}

export class ExternalDbService {
  constructor(protected database: Database) {}

  async createAwWarranty(data: CreateWarrantyInput): Promise<CreateWarrantyResult> {
    return this.database.sequelize.transaction(async (transaction: Transaction) => {
      const header = await this.database.awWarrantyHeader.create(
        {
          FirstName: data.firstName,
          LastName: data.lastName,
          Email: data.email,
          Telephone: data.telephone ?? null,
          Address1: data.address1 ?? null,
          City: data.city ?? null,
          State: data.state ?? null,
          Country: data.country ?? null,
          Zip: data.zip ?? null,
          AgreeToNewsUpdates: data.agreeToNewsUpdates ?? false,
        },
        { transaction }
      );

      const headerId = header.getDataValue('WarrantyHeaderId');

      if (data.lines?.length) {
        for (const line of data.lines) {
          await this.database.awWarrantyLine.create(
            {
              WarrantyHeaderId: headerId,
              ProductType: line.productType,
              ProductSeries: line.productSeries ?? null,
              Quantity: line.quantity ?? null,
              InstallationDate: line.installationDate,
              SerialNumber: line.serialNumber ?? null,
            },
            { transaction }
          );
        }
      }

      return {
        success: true,
        headerId,
      };
    });
  }

  async createOrUpdateEntForm(form: EntForm): Promise<CreateOrUpdateEntFormResult> {
    return this.database.sequelize.transaction(async (transaction: Transaction) => {
      const normalizeUuid = (value?: string): string =>
        typeof value === 'string' && uuidValidate(value) ? value : uuidv4();

      const safeSessionId = normalizeUuid(form.sessionId);
      const safeFormId = normalizeUuid(form.formId);

      let header = await this.database.entFormHeader.findOne({
        where: { SessionId: safeSessionId },
        transaction,
      });

      if (header) {
        await header.update(
          {
            FormId: safeFormId,
            FormName: typeof form.formName === 'string' ? form.formName : undefined,
            UpdatedDateTime: new Date(),
          },
          { transaction }
        );
      } else {
        header = await this.database.entFormHeader.create(
          {
            FormHeaderId: uuidv4(),
            SessionId: safeSessionId,
            FormId: safeFormId,
            FormName: typeof form.formName === 'string' ? form.formName : undefined,
            CreatedDateTime: new Date(),
          },
          { transaction }
        );
      }

      const headerId = header.getDataValue('FormHeaderId');

      if (form.lines?.length) {
        for (const line of form.lines) {
          const safeFieldId = normalizeUuid(line.fieldId);

          const existingLine = await this.database.entFormLine.findOne({
            where: {
              FormHeaderId: headerId,
              FieldId: safeFieldId,
            },
            transaction,
          });

          if (existingLine) {
            await existingLine.update(
              {
                FieldName: line.fieldName,
                FieldType: line.fieldType,
                FieldValue: line.fieldValue ?? null,
              },
              { transaction }
            );
          } else {
            await this.database.entFormLine.create(
              {
                FormLineId: uuidv4(),
                FormHeaderId: headerId,
                FieldId: safeFieldId,
                FieldName: line.fieldName,
                FieldType: line.fieldType,
                FieldValue: line.fieldValue ?? null,
              },
              { transaction }
            );
          }
        }
      }

      return {
        success: true,
        headerId,
        sessionId: safeSessionId,
        formId: safeFormId,
      };
    });
  }
}
