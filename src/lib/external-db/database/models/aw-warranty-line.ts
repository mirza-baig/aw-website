import { DataTypes, Model, ModelStatic, Optional, Sequelize } from 'sequelize';

export interface AwWarrantyLineAttributes {
  WarrantyLineId: string;
  WarrantyHeaderId: string;
  ProductType: string;
  ProductSeries?: string | null;
  Quantity?: number | null;
  InstallationDate: Date;
  SerialNumber?: string | null;
}

export type AwWarrantyLineCreationAttributes = Optional<AwWarrantyLineAttributes, 'WarrantyLineId'>;

export function define(sequelize: Sequelize) {
  return sequelize.define<Model<AwWarrantyLineAttributes, AwWarrantyLineCreationAttributes>>(
    'AwWarrantyLine',
    {
      WarrantyLineId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      WarrantyHeaderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      ProductType: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ProductSeries: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      Quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      InstallationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      SerialNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      tableName: 'AwWarrantyLines',
      timestamps: false,
    }
  );
}

export function associate(models: { [key: string]: ModelStatic<Model> }) {
  models.AwWarrantyLine.belongsTo(models.AwWarrantyHeader, {
    foreignKey: 'WarrantyHeaderId',
  });
}
