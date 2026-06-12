import { FormikValues, useFormikContext } from 'formik';
import React, { ReactElement } from 'react';
import Dropdown from 'src/helpers/CustomForms/Dropdown';
import { InputText } from 'src/helpers/CustomForms/InputText';

import { doorsTypes, productSeriesMappings, windowsTypes } from './WarrantyRegistration.helper';

type ProductFieldsProps = {
  productIndex: number;
  removeProduct?: () => void;
};

const ProductFields = (props: ProductFieldsProps): ReactElement => {
  const { productIndex, removeProduct } = props;

  const { values } = useFormikContext<FormikValues>();

  return (
    <React.Fragment key={productIndex}>
      <div className="col-span-12 md:col-span-3">
        <Dropdown
          id={`warranty_products.${productIndex}.producttype`}
          name={`warranty_products.${productIndex}.producttype`}
          label={'Product type'}
          aria-label={'Product type'}
          aria-required={true}
          required={true}
          enableInlineOptionsRendering={false}
        >
          <option value="" selected disabled>
            Select One
          </option>
          <optgroup label="Windows">
            {windowsTypes.map((windowType) => (
              <option key={windowType.value} value={windowType.value}>
                {windowType.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="Doors">
            {doorsTypes.map((doorType) => (
              <option key={doorType.value} value={doorType.value}>
                {doorType.label}
              </option>
            ))}
          </optgroup>
        </Dropdown>
      </div>
      <div className="col-span-12 md:col-span-3">
        {values['warranty_products'][productIndex]['producttype'] !== 'Storm Doors' ? (
          <Dropdown
            id={`warranty_products.${productIndex}.productseries`}
            name={`warranty_products.${productIndex}.productseries`}
            label="Product series"
            aria-required={true}
            required={true}
            enableInlineOptionsRendering
          >
            <option value="" selected disabled>
              Select One
            </option>
            {values['warranty_products'][productIndex]['producttype'] ? (
              productSeriesMappings[
                values['warranty_products'][productIndex][
                  'producttype'
                ] as keyof typeof productSeriesMappings
              ].options?.map((option) => (
                <option key={option.value} value={`${option.value}|${option.productId}`}>
                  {option.label}
                </option>
              ))
            ) : (
              <></>
            )}
          </Dropdown>
        ) : (
          <InputText
            id={`warranty_products.${productIndex}.serialnumber`}
            name={`warranty_products.${productIndex}.serialnumber`}
            type="text"
            label="Serial Number (Located On The Hinge)"
            placeholder="Enter Serial Number"
            required
            maxLength={30}
            aria-required="true"
          />
        )}
      </div>
      {values['warranty_products'][productIndex]['producttype'] !== 'Storm Doors' && (
        <div className="col-span-12 md:col-span-3">
          <Dropdown
            id={`warranty_products.${productIndex}.quantity`}
            name={`warranty_products.${productIndex}.quantity`}
            label="Quantity"
            aria-required={true}
            required={true}
            options={Array.from({ length: 10 }, (_, i) => ({
              label: `${i + 1}`,
              value: `${i + 1}`,
            }))}
          >
            <option value="" selected disabled>
              Select One
            </option>
          </Dropdown>
        </div>
      )}
      <div className="col-span-12 md:col-span-3">
        <InputText
          id={`warranty_products.${productIndex}.installationdate`}
          name={`warranty_products.${productIndex}.installationdate`}
          label="Installation date"
          aria-required={true}
          required={true}
          type="date"
        />
      </div>
      <div className="col-span-12 border-b border-gray pb-s">
        <h2
          className="inline-block cursor-pointer font-sans text-xxs font-heavy text-darkprimary"
          onClick={removeProduct}
        >
          REMOVE PRODUCT
        </h2>
      </div>
    </React.Fragment>
  );
};

export default ProductFields;
