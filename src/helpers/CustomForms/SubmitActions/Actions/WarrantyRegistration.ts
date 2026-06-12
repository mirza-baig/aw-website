import { BaseSubmitAction, BaseSubmitProps, ExecutionResult } from '../BaseSubmitAction';

type WarrantyProductProps = {
  productType: string;
  productSeries: string;
  quantity: number;
  productId: string;
  installationDate: string;
  serialNumber: string;
};

type WarrantyRegistrationPayload = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  address1: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  agreeToNewsUpdates: boolean;
  lines: Array<WarrantyProductProps>;
};

export class WarrantyRegistration extends BaseSubmitAction {
  constructor(params: BaseSubmitProps) {
    super(params);
  }

  private getPayload(): WarrantyRegistrationPayload {
    let country = this.formData['country'];

    if (this.formData['country'] === 'Other') {
      country = this.formData['location'];
      this.formData['state'] = '';
    }

    return {
      firstName: this.formData['first_name'],
      lastName: this.formData['last_name'],
      email: this.formData['email'],
      telephone: this.formData['phone'],
      address1: this.formData['address1'],
      city: this.formData['city'],
      state: this.formData['state'],
      country: country,
      zip: this.formData['zip'],
      agreeToNewsUpdates:
        Array.isArray(this.formData['newsletter']) &&
        this.formData['newsletter'].length > 0 &&
        this.formData['newsletter'][0] === 'on',
      lines: this.formData['warranty_products'].map((warrantyProduct: Record<string, string>) => {
        const [productSeries, productId] = warrantyProduct.productseries.split('|');

        return {
          productType: warrantyProduct.producttype,
          productSeries: productSeries ?? '',
          quantity: (warrantyProduct.quantity && Number.parseInt(warrantyProduct.quantity)) ?? 1,
          productId: productId ?? '',
          installationDate: warrantyProduct.installationdate,
          serialNumber: warrantyProduct.serialnumber,
        };
      }),
    };
  }

  override async executeAction(): Promise<ExecutionResult> {
    const payload: string = JSON.stringify(this.getPayload());
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    };

    const response = await fetch(
      `/api/aw/custom-forms/submit-actions/warranty-registration`,
      requestOptions
    );

    return {
      success: response.status === 200,
      errorMessage:
        this.actionFieldsProps?.errorMessage?.value ?? 'Error occured while registering warranty',
    };
  }
}
