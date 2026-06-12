import { DataTypes, Model, ModelStatic, Optional, Sequelize } from 'sequelize';

export interface AwWarrantyHeaderAttributes {
  WarrantyHeaderId: string;
  FirstName?: string | null;
  LastName?: string | null;
  Email?: string | null;
  Telephone?: string | null;
  Address1?: string | null;
  City?: string | null;
  State?: string | null;
  Country?: string | null;
  Zip?: string | null;
  AgreeToNewsUpdates?: boolean | null;
}

export type AwWarrantyHeaderCreationAttributes = Optional<
  AwWarrantyHeaderAttributes,
  'WarrantyHeaderId'
>;

export function define(sequelize: Sequelize) {
  return sequelize.define<Model<AwWarrantyHeaderAttributes, AwWarrantyHeaderCreationAttributes>>(
    'AwWarrantyHeader',
    {
      WarrantyHeaderId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      FirstName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      LastName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      Email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      Telephone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Address1: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      City: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      State: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      Zip: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      AgreeToNewsUpdates: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      tableName: 'AwWarrantyHeaders',
      timestamps: false,
    }
  );
}

export function associate(models: { [key: string]: ModelStatic<Model> }) {
  models.AwWarrantyHeader.hasMany(models.AwWarrantyLine, {
    foreignKey: 'WarrantyHeaderId',
  });
}
