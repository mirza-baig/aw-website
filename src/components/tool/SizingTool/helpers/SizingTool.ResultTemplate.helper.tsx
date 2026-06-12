import { Result } from '@coveo/headless';
import { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { SizingToolProps } from 'components/tool/SizingTool/helpers/SizingTool.types';
import { cta1ToButtonProps, cta2ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import { Eyebrow } from 'helpers/Eyebrow';
import Headline from 'helpers/Headline/Headline';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import { Subheadline } from 'helpers/Subheadline';
import { extractURLParts } from 'lib/coveo';

import { Sitecore } from '.sitecore/AndersenWindows.model';

interface RenderingFields {
  headline: Sitecore.FieldSets.Headline;
  subheadline: Sitecore.FieldSets.Subheadline;
  eyebrow: Sitecore.FieldSets.Eyebrow;
  cta: Sitecore.FieldSets.Cta1 & Sitecore.FieldSets.Cta2 & Sitecore.FieldSets.Cta3;
  productImage: {
    fields: {
      primaryImage: ImageField;
      primaryImageMobile: ImageField;
      primaryImageCaption: Field<string>;
    };
  };
}

const SizingToolTemplate = (props: SizingToolProps) => {
  const fieldsToInclude = [
    'aw_xmc_productname',
    'aw_xmc_productid',
    'aw_xmc_productdimensions',
    'aw_xmc_configurationname',
    'aw_xmc_productdetailpagelink',
    'aw_xmc_sizingdocumentspagelink',
    'aw_xmc_productimage',
    'aw_xmc_productimage_alt',
    'aw_xmc_productimage_height',
    'aw_xmc_productimage_width',
    'aw_xmc_productseries',
  ];

  const getRenderingFields = (_result: Result, props: SizingToolProps) => {
    const getImageFields = () => ({
      value: {
        src: _result.raw.aw_xmc_productimage,
        alt: _result.raw.aw_xmc_productimage_alt,
        width: _result.raw.aw_xmc_productimage_width ?? 324,
        height: _result.raw.aw_xmc_productimage_height ?? 201,
      },
    });

    const eyebrowText = Array.isArray(_result.raw.aw_xmc_productseries)
      ? _result.raw.aw_xmc_productseries[0]
      : '';

    return {
      headline: {
        fields: {
          headlineText: {
            value: _result.raw.aw_xmc_productname,
          },
        },
      },
      subheadline: {
        fields: {
          subheadlineText: {
            value: _result.raw.aw_xmc_configurationname,
          },
        },
      },
      eyebrow: {
        fields: {
          eyebrowText: {
            value: eyebrowText,
          },
        },
      },
      cta: {
        fields: {
          cta1Link: {
            value:
              _result.raw.aw_xmc_productdetailpagelink !== undefined
                ? {
                    ...extractURLParts(_result.raw.aw_xmc_productdetailpagelink as string),
                    title: props.fields?.productDetailsPageCTAText.value,
                    text: props.fields?.productDetailsPageCTAText.value,
                  }
                : {},
          },
          cta1Icon: {
            fields: {
              Value: {
                value: 'arrow',
              },
            },
          },
          cta1Style: {
            fields: {
              Value: {
                value: 'primary',
              },
            },
          },
          cta2Link: {
            value:
              _result.raw.aw_xmc_sizingdocumentspagelink !== undefined
                ? {
                    ...extractURLParts(_result.raw.aw_xmc_sizingdocumentspagelink as string),
                    title: props.fields?.sizingDocumentsCTAText.value,
                    text: props.fields?.sizingDocumentsCTAText.value,
                  }
                : {},
          },
          cta2Icon: {
            fields: {
              Value: {
                value: '',
              },
            },
          },
          cta2Style: {
            fields: {
              Value: {
                value: 'link',
              },
            },
          },
        },
      },
      productImage: {
        fields: {
          primaryImage: getImageFields(),
          primaryImageMobile: getImageFields(),
          primaryImageCaption: {
            value: '',
          },
        },
      },
    };
  };

  return {
    priority: 1,
    conditions: [],
    fields: ['sc_templateid', ...fieldsToInclude],
    content: (result: Result) => {
      const renderingFields = getRenderingFields(result, props) as unknown as RenderingFields;
      return (
        <li
          key={result.uniqueId}
          className={classNames(
            'col-span-12 flex h-full flex-col border border-gray p-s',
            props.fields.facets.length > 0 ? 'ml:col-span-4' : 'ml:col-span-3'
          )}
        >
          <Eyebrow
            classes="font-sans uppercase text-small ml:text-xxs font-heavy text-dark-gray mb-xxs"
            {...renderingFields.eyebrow}
          />
          <Headline
            classes="font-sans font-heavy text-sm-xs ml:text-xs mb-xxs"
            {...renderingFields.headline}
          />
          <Subheadline
            classes="font-serif! text-small font-regular mb-s"
            {...renderingFields.subheadline}
          />

          <ImagePrimary
            additionalDesktopClasses="w-fit mx-auto mb-s"
            additionalMobileClasses="w-fit mx-auto mb-s"
            imageLayout="intrinsic"
            {...renderingFields.productImage}
          />
          <ButtonGroup
            cta1={cta1ToButtonProps(renderingFields.cta, 'mr-0')}
            cta2={cta2ToButtonProps(
              renderingFields.cta,
              'ml-0 font-serif! text-small font-regular! text-darkprimary hover:decoration-darkprimary'
            )}
            wrapperClasses="flex flex-col md:flex-col items-center justify-center md:space-x-0 md:justify-center mb-0 gap-y-s mt-auto"
          />
        </li>
      );
    },
  };
};

export default SizingToolTemplate;
