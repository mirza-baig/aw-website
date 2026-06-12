'use client';

import { Field, ImageField, ImageFieldValue, useSitecore } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { SectionHeadlineTheme } from 'components/general/SectionHeadline/helpers/SectionHeadline.theme';
import {
  ArrayHelpers,
  FieldArray,
  Formik,
  FormikHelpers,
  FormikTouched,
  FormikValues,
} from 'formik';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import AddressGroup from 'helpers/CustomForms/AddressGroup/AddressGroup';
import Checkbox from 'helpers/CustomForms/Checkbox';
import { FormFieldsTheme } from 'helpers/CustomForms/FormFields.Theme';
import { InputPhone } from 'helpers/CustomForms/InputPhone';
import { InputText } from 'helpers/CustomForms/InputText';
import NavigationButton from 'helpers/CustomForms/NavigationButton.Helper';
import DisclaimerText from 'helpers/DisclaimerText/DisclaimerText';
import { Eyebrow } from 'helpers/Eyebrow';
import Headline from 'helpers/Headline/Headline';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import SingleButton from 'helpers/SingleButton/SingleButton';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { FormsConstants } from 'lib/constants/forms-constants';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useBVScript } from 'lib/utils/use-bv-script';
import { useState } from 'react';
import { ProductByBVIdQueryResult } from 'src/app/api/aw/bazaarvoice-product-by-bvid/product-by-bv-id-service';
import { environment } from 'startup/environment';
import * as Yup from 'yup';

import ProductFields from './helpers/ProductFields.helper';
import {
  warrantyRegistrationInitialValues,
  warrantyRegistrationValidationSchema,
} from './helpers/WarrantyRegistration.helper';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import { formActionFactory } from '.sitecore/aw-form-action-factory';

type WarrantyRegistrationProps = ComponentProps &
  Sitecore.Forms.Custom.WarrantyRegistration.WarrantyRegistration;

function WarrantyRegistration_Default(props: WarrantyRegistrationProps) {
  const { themeName, themeData } = useTheme(FormFieldsTheme);
  const sectionHeadlineTheme = useTheme(SectionHeadlineTheme('left', 'dark')).themeData;

  // Add the bazaarvoice script
  useBVScript({ environment, theme: themeName });

  const sitecoreContext = useSitecore();
  const language = sitecoreContext.page.layout.sitecore.context.language;

  const [isWarrantyRegistered, setIsWarrantyRegistered] = useState(false);
  const [showFormError, setShowFormError] = useState<false | string>(false);
  const [isSubmitButtonEnabled, setIsSubmitButtonEnabled] = useState(true);
  const [showThankYouBot, setShowThankYouBot] = useState(false);
  const [bazaarvoiceProducts, setBazaarvoiceProducts] = useState([]);
  const getHiddenFieldValue = (): string => {
    const hiddenField = document.querySelector('input[name="website"]') as HTMLInputElement;
    return hiddenField?.value;
  };

  const fetchProductsByBVIds = async (productIds: Array<string>) => {
    if (productIds.length > 0) {
      try {
        const response = await fetch('/api/aw/bazaarvoice-product-by-bvid', {
          method: 'POST',
          body: JSON.stringify({ productIds: productIds, language: language }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBazaarvoiceProducts(data.products);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
    }
  };

  const handleSubmit = async (
    values: FormikValues,
    touched: FormikTouched<FormikValues>,
    setTouched: FormikHelpers<FormikValues>['setTouched'],
    validateForm: FormikHelpers<FormikValues>['validateForm']
  ) => {
    const updateTouchedState = (): Record<string, unknown> => {
      const touchedState = Object.keys(values)?.reduce(
        (acc: Record<string, boolean>, field: string) => {
          if (field === 'warranty_products') {
            values[field].forEach(
              (warrantyProduct: Array<Record<string, string>>, productIndex: number) =>
                Object.keys(warrantyProduct).forEach((productField) => {
                  // @ts-ignore we can ignore typescript error "Element implicitly has an 'any' type because expression of type 'any' can't be used to index type"
                  acc[field] = acc[field] ?? [];
                  // @ts-ignore we can ignore typescript error "Element implicitly has an 'any' type because expression of type 'any' can't be used to index type"
                  acc[field][productIndex] = { ...acc[field][productIndex], [productField]: true };
                })
            );
          } else {
            acc[field] = true;
          }
          return acc;
        },
        {}
      );

      const _touched = { ...touched, ...touchedState };

      setTouched(_touched, true);
      return _touched;
    };

    updateTouchedState();

    const errorFieldsObject = await validateForm();

    if (Object.keys(errorFieldsObject).length === 0) {
      setIsSubmitButtonEnabled(false);
      setShowFormError('Processing... please wait');

      const actionHandler = formActionFactory(
        {
          templateName: 'Warranty Registration',
        },
        values
      );

      if (getHiddenFieldValue() === '') {
        const result = await actionHandler?.executeAction(true);
        if (result?.success) {
          setIsWarrantyRegistered(true);

          const productIDs = values['warranty_products']
            .map(
              (warrantyProduct: Record<string, string>) =>
                warrantyProduct.productseries.split('|')?.[1] ?? ''
            )
            .filter((product: string) => product); //Remove empty products if any

          fetchProductsByBVIds(productIDs);
        } else {
          setIsSubmitButtonEnabled(true);
        }
      } else {
        setShowThankYouBot(true);
      }
    } else {
      setShowFormError('Please fill out all required fields.');
    }
  };
  return (
    <div data-component="forms/requestquote">
      {showThankYouBot ? (
        <>
          <Headline
            classes="text-theme-text text-sm-m md:text-m font-heavy mb-s"
            fields={{
              headlineText: props.fields?.thankYouHeading,
            }}
          />
          <BodyCopy
            classes="text-theme-body text-body text-black mb-s"
            fields={{ body: props.fields?.thankYouText }}
          />
        </>
      ) : (
        <>
          <Eyebrow {...props} classes="font-sans font-heavy text-sm-xxs mb-xxxs" />
          <div className="col-span-12">
            <Headline
              classes={sectionHeadlineTheme.classes.headlineContainer}
              fields={{
                headlineText: isWarrantyRegistered
                  ? (props.fields?.thankYouHeading ?? '')
                  : (props.fields?.headlineText ?? ''),
              }}
            />
          </div>
          <BodyCopy
            classes="font-sans! [&_.body-copy_div]:text-s! font-medium mb-l md:mb-[56px]"
            fields={{
              body: isWarrantyRegistered
                ? (props.fields?.thankYouText ?? '')
                : (props.fields?.body ?? ''),
            }}
          />

          <Formik
            initialValues={warrantyRegistrationInitialValues}
            validationSchema={Yup.object().shape(warrantyRegistrationValidationSchema)}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={() => undefined}
          >
            {({ values, touched, setTouched, validateForm, isValid }) => {
              return (
                !isWarrantyRegistered && (
                  <form className="mx-auto my-s grid grid-cols-12 gap-xxs gap-y-m md:max-w-(--breakpoint-lg) md:gap-s">
                    {/* Contact section */}
                    <div className="col-span-12  font-sans text-s font-medium">
                      Contact Information
                      <span className={classNames('font-serif', themeData.classes.label)}>
                        * Indicates a required field
                      </span>
                    </div>
                    {/* first name */}
                    <div className="col-span-12  md:col-span-6">
                      <InputText
                        id="warrantyRegistration-first-name"
                        name="first_name"
                        type="text"
                        label="First name"
                        placeholder="First name"
                        required
                        maxLength={25}
                        aria-required="true"
                      />
                    </div>
                    {/* last name */}
                    <div className="col-span-12 md:col-span-6">
                      <InputText
                        id="warrantyRegistration-last-name"
                        name="last_name"
                        type="text"
                        label="Last name"
                        placeholder="Last name"
                        required
                        maxLength={25}
                        aria-required="true"
                      />
                    </div>
                    {/* Email */}
                    <div className="col-span-12 md:col-span-6">
                      <InputText
                        id="warrantyRegistration-email"
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="Email"
                        maxLength={50}
                        subLabel={props?.fields?.privacyPolicyText?.value}
                        required
                        aria-required
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <InputPhone
                        id="warrantyRegistration-phone"
                        name="phone"
                        label="Phone"
                        placeholder="Phone"
                        required
                        aria-required
                      />
                    </div>
                    <AddressGroup
                      address1={{
                        id: 'warrantyRegistration-address1',
                        name: 'address1',
                        label: 'Address',
                        placeholder: 'Address',
                        classes: 'col-span-12 md:col-span-6',
                        required: true,
                      }}
                      country={{
                        id: 'warrantyRegistration-country',
                        name: 'country',
                        label: 'Country',
                        classes: 'col-span-12 md:col-span-6',
                        required: true,
                      }}
                      city={{
                        id: 'warrantyRegistration-city',
                        name: 'city',
                        label:
                          values['country'] === FormsConstants.Country.Canada
                            ? 'Municipality'
                            : 'City',
                        placeholder:
                          values['country'] === FormsConstants.Country.Canada
                            ? 'Municipality'
                            : 'City',
                        classes: 'col-span-12 md:col-span-6',
                        required: true,
                      }}
                      state={{
                        id: 'warrantyRegistration-state',
                        name: 'state',
                        label:
                          values['country'] === FormsConstants.Country.Canada
                            ? 'Province'
                            : 'State',
                        classes: 'col-span-12 md:col-span-3',
                        required: true,
                      }}
                      location={{
                        id: 'warrantyRegistration-location',
                        name: 'location',
                        label: 'Location',
                        placeholder: 'Location',
                        classes: 'col-span-12 md:col-span-3',
                        required: true,
                      }}
                      zipCode={{
                        id: 'warrantyRegistration-zipCode',
                        name: 'zip',
                        label:
                          values['country'] === FormsConstants.Country.Canada
                            ? 'Postal Code'
                            : 'Zip',
                        placeholder:
                          values['country'] === FormsConstants.Country.Canada
                            ? 'Postal Code'
                            : 'Zip',
                        classes: 'col-span-12 md:col-span-3',
                        required: true,
                      }}
                    />

                    {/* Hidden Field */}
                    <div className="h-0 overflow-hidden p-0" aria-hidden="true">
                      <InputText
                        label="Do not fill out this field."
                        placeholder={'Do not fill out this field.'}
                        name="website"
                      />
                    </div>

                    {/* Product Section */}
                    <div className="col-span-12 mt-s font-sans text-s font-medium">Product</div>
                    <FieldArray
                      name="warranty_products"
                      render={(arrayHelpers: ArrayHelpers) => (
                        <>
                          {values.warranty_products?.map((_, index) => (
                            <ProductFields
                              key={`${_.productid}_${_.serialnumber}_${index}`}
                              productIndex={index}
                              removeProduct={() => {
                                arrayHelpers.remove(index);
                                if (values['warranty_products'].length === 1) {
                                  arrayHelpers.push({
                                    producttype: '',
                                    productseries: '',
                                    quantity: '',
                                    serialnumber: '',
                                    installationdate: '',
                                    productid: '',
                                  });
                                }
                              }}
                            />
                          ))}
                          <div className="col-span-12">
                            <div
                              className="relative mx-auto flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-gray py-xs text-center font-sans! text-small font-heavy text-darkprimary ml:text-xxs"
                              onClick={() =>
                                arrayHelpers.push({
                                  producttype: '',
                                  productseries: '',
                                  quantity: '',
                                  serialnumber: '',
                                  installationdate: '',
                                  productid: '',
                                })
                              }
                            >
                              <div tabIndex={0} className="mb-xxs">
                                <SvgIcon
                                  className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                                  icon="plus"
                                  size="lg"
                                />
                              </div>
                              <span className="font-serif! text-body font-regular text-black">
                                Add another product
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    />
                    <div className="col-span-12 md:col-span-6">
                      <Checkbox
                        options={[
                          {
                            id: 'warrantyRegistration-optin',
                            label: props.fields?.subscribeToNewsUpdateText.value ?? '',
                          },
                        ]}
                        name="newsletter"
                      />
                    </div>
                    <div className="col-span-12">
                      <NavigationButton
                        type="button"
                        onClick={() => handleSubmit(values, touched, setTouched, validateForm)}
                        className={classNames('mx-auto w-[137px] text-center md:mx-0 md:w-[218px]')}
                        disabled={!isSubmitButtonEnabled}
                      >
                        <span className="w-full text-center">Submit</span>
                      </NavigationButton>
                      {(!isSubmitButtonEnabled || !isValid) && (
                        <span
                          className={
                            !isValid
                              ? classNames(
                                  themeData.classes.errorMessage,
                                  themeData.classes.errorTextColor
                                )
                              : classNames('my-xxs block w-fit font-serif text-body text-dark-gray')
                          }
                        >
                          {showFormError}
                        </span>
                      )}
                    </div>
                  </form>
                )
              );
            }}
          </Formik>
          {!isWarrantyRegistered && (
            <DisclaimerText
              fields={{
                ...props.fields,
              }}
              disclaimerClasses={themeData.classes.disclaimerText}
            />
          )}
          {isWarrantyRegistered && bazaarvoiceProducts.length > 0 && (
            <>
              <Headline
                classes="text-theme-text text-sm-m md:text-m font-heavy mb-xxs"
                fields={{
                  headlineText: props.fields?.productReviewSectionHeading ?? '',
                }}
              />
              <BodyCopy
                fields={{
                  body: props.fields?.productReviewSectionCopy ?? '',
                }}
              />
              <div className="mx-auto my-s grid grid-cols-12 gap-xxs gap-y-m md:max-w-(--breakpoint-lg) md:gap-s">
                {isWarrantyRegistered &&
                  bazaarvoiceProducts.map((product) => ProductReviewCard(product))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function SubmitReviewClick(externalId: string) {
  // @ts-ignore $BV will be available after the page loads.
  $BV.ui('rr', 'submit_review', { productId: externalId });
}

function ProductReviewCard(
  product: ProductByBVIdQueryResult & {
    productSeries: { targetItem: { productTypeName: Field<string> } };
  }
) {
  const imageField: ImageField = {
    value: product.productImage as unknown as ImageFieldValue,
  };

  const ratingButtonProps = {
    cta1Icon: {
      id: 'f8ad4587-51a4-4e66-8eec-b448f78b4cb2',
      url: 'http://localhost/sitecore/login/sitecore/system/Settings/Foundation/EnterpriseWeb/Enums/Icons/Augmented-Reality',
      name: 'Augmented Reality',
      displayName: 'Augmented Reality',
      fields: {
        Value: {
          value: 'arrow',
        },
      },
      templateId: 'd2923fee-da4e-49be-830c-e27764dfa269',
      templateName: 'Enum',
    },
    cta1Link: {
      value: {
        href: '',
        text: 'Start rating',
        anchor: '',
        linktype: 'internal',
        class: '',
        title: '',
        target: '',
        querystring: '',
        id: '{BD66C47E-42B0-4EDD-BAD3-4BC981C05E5D}',
      },
    },
    cta1Style: {
      id: '8aedd89c-e161-41d4-b773-6a6097a19372',
      url: 'http://localhost/sitecore/login/sitecore/system/Settings/Foundation/EnterpriseWeb/Enums/CTA-Styles/Secondary',
      name: 'Secondary',
      displayName: 'Primary',
      fields: {
        Value: {
          value: 'primary',
        },
      },
      templateId: 'd2923fee-da4e-49be-830c-e27764dfa269',
      templateName: 'Enum',
    },
    cta1ModalLinkText: {
      value: '',
    },
    cta1AriaLabel: {
      value: '',
    },
  };
  return (
    <div className="col-span-12 border border-gray p-s md:col-span-3">
      <Eyebrow
        fields={{ eyebrowText: product.productSeries.targetItem.productTypeName }}
        classes="font-sans! text-xxs text-dark-gray font-heavy mb-xxs"
      />
      <h3 className="mb-s font-sans text-xs font-heavy">{product.productName.value}</h3>
      <div className="relative mb-s">
        <ImageWrapper
          image={imageField}
          imageLayout="responsive"
          additionalDesktopClasses="max-w-full"
          additionalMobileClasses="max-w-full"
        ></ImageWrapper>
      </div>
      <div
        className="flex"
        onClick={(e) => {
          e.preventDefault();
          SubmitReviewClick(product.bazaarvoiceProductId?.value);
        }}
      >
        <SingleButton classes={{ wrapper: 'mb-0! mx-auto!' }} fields={ratingButtonProps} />
      </div>
    </div>
  );
}

export const Default = withDatasourceCheck(WarrantyRegistration_Default);
