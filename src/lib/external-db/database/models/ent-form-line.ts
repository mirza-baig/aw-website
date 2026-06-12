import { DataTypes, Model, ModelStatic, Optional, Sequelize } from 'sequelize';

export interface EntFormLineAttributes {
  FormLineId: string;
  FormHeaderId: string;
  FieldId: string;
  FieldName: string;
  FieldType: string;
  FieldValue?: string | null;
}

export type EntFormLineCreationAttributes = Optional<EntFormLineAttributes, 'FormLineId'>;

export function define(sequelize: Sequelize) {
  return sequelize.define<Model<EntFormLineAttributes, EntFormLineCreationAttributes>>(
    'EntFormLine',
    {
      FormLineId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      FormHeaderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      FieldId: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      FieldName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      FieldType: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      FieldValue: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'EntFormLine',
      timestamps: false,
    }
  );
}

export function associate(models: { [key: string]: ModelStatic<Model> }) {
  models.EntFormLine.belongsTo(models.EntFormHeader, {
    foreignKey: 'FormHeaderId',
  });
}
