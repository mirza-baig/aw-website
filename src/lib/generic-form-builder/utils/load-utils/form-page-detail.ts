import { FormItemDetail } from './form-item-detail';

export type FormPageDetail = {
  label: string;
  includeInSteps: boolean;
  hideStepper: boolean;
  formFieldDetails: FormItemDetail[];
};
