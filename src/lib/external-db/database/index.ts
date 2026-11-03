import config from 'aw.config.server';
import { Sequelize } from 'sequelize';
import * as tedious from 'tedious';

import { Database } from './database';

const sequelize = new Sequelize(
  config.externalDb.database,
  config.externalDb.username,
  config.externalDb.password,
  {
    host: config.externalDb.server,
    port: 1433,
    dialect: 'mssql',
    dialectModule: tedious,
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: false,
      },
    },
    logging: false,
  }
);

const database = new Database(sequelize);

export default database;
