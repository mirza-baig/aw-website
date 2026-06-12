import { ModelDefined, Sequelize } from 'sequelize';

import {
  associate as associateAwWarrantyHeader,
  AwWarrantyHeaderAttributes,
  AwWarrantyHeaderCreationAttributes,
  define as defineAwWarrantyHeader,
} from './models/aw-warranty-header';
import {
  associate as associateAwWarrantyLine,
  AwWarrantyLineAttributes,
  AwWarrantyLineCreationAttributes,
  define as defineAwWarrantyLine,
} from './models/aw-warranty-line';
import {
  associate as associateEntFormHeader,
  define as defineEntFormHeader,
  EntFormHeaderAttributes,
  EntFormHeaderCreationAttributes,
} from './models/ent-form-header';
import {
  associate as associateEntFormLine,
  define as defineEntFormLine,
  EntFormLineAttributes,
  EntFormLineCreationAttributes,
} from './models/ent-form-line';

export class Database {
  public readonly awWarrantyHeader: ModelDefined<
    AwWarrantyHeaderAttributes,
    AwWarrantyHeaderCreationAttributes
  >;

  public readonly awWarrantyLine: ModelDefined<
    AwWarrantyLineAttributes,
    AwWarrantyLineCreationAttributes
  >;

  public readonly entFormHeader: ModelDefined<
    EntFormHeaderAttributes,
    EntFormHeaderCreationAttributes
  >;

  public readonly entFormLine: ModelDefined<EntFormLineAttributes, EntFormLineCreationAttributes>;

  constructor(public readonly sequelize: Sequelize) {
    const models = {
      AwWarrantyHeader: defineAwWarrantyHeader(sequelize),
      AwWarrantyLine: defineAwWarrantyLine(sequelize),
      EntFormHeader: defineEntFormHeader(sequelize),
      EntFormLine: defineEntFormLine(sequelize),
    };

    associateAwWarrantyHeader(models);
    associateAwWarrantyLine(models);
    associateEntFormHeader(models);
    associateEntFormLine(models);

    this.awWarrantyHeader = models.AwWarrantyHeader;
    this.awWarrantyLine = models.AwWarrantyLine;
    this.entFormHeader = models.EntFormHeader;
    this.entFormLine = models.EntFormLine;
  }
}
