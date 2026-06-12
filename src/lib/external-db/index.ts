import database from './database';
import { ExternalDbService } from './external-db-service';

const service = new ExternalDbService(database);

export default service;

export type {
  CreateOrUpdateEntFormResult,
  CreateWarrantyInput,
  CreateWarrantyLineInput,
  CreateWarrantyResult,
  EntForm,
  EntFormLineInput,
} from './external-db-service';
