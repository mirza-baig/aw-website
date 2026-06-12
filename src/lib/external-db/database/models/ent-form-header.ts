import { DataTypes, Model, ModelStatic, Optional, Sequelize } from 'sequelize';

export interface EntFormHeaderAttributes {
  FormHeaderId: string;
  FormId: string;
  FormName?: string;
  SessionId: string;
  CreatedDateTime?: Date;
  UpdatedDateTime?: Date;
}

export type EntFormHeaderCreationAttributes = Optional<
  EntFormHeaderAttributes,
  'FormHeaderId' | 'CreatedDateTime' | 'UpdatedDateTime'
>;

export function define(sequelize: Sequelize) {
  return sequelize.define<Model<EntFormHeaderAttributes, EntFormHeaderCreationAttributes>>(
    'EntFormHeader',
    {
      FormHeaderId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      FormId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      FormName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      SessionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      CreatedDateTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      UpdatedDateTime: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'EntFormHeader',
      timestamps: false,
    }
  );
}

export function associate(models: { [key: string]: ModelStatic<Model> }) {
  models.EntFormHeader.hasMany(models.EntFormLine, {
    foreignKey: 'FormHeaderId',
  });
}
