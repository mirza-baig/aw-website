import { Facet as HeadlessFacet, FacetValue } from '@coveo/headless';
import { Text } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Headline from 'helpers/Headline/Headline';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { decimalToFraction, fractionToDecimal } from 'lib/utils/dimension-conversion';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { SizingToolProps } from './SizingTool.types';

interface ProductTypeFacetProps {
  controller: HeadlessFacet;
  setIsProductTypeSelected: Dispatch<SetStateAction<boolean>>;
}

// Door or Window productType Facets
export const ProductTypeFacet = (props: ProductTypeFacetProps & SizingToolProps) => {
  const { controller, setIsProductTypeSelected } = props;

  const [state, setState] = useState(controller?.state);
  useEffect(() => {
    controller?.subscribe(() => setState(controller?.state));
    const url = window.location.hash;
    const params = new URLSearchParams(url.slice(1));
    const productTypeFacet = params.get(`f:${state?.facetId}`);
    if (productTypeFacet) {
      setIsProductTypeSelected(true);
    }
    // we can ignore 'state.facetId' from expected dependency, as we only want this useEffect to execute once when controller is updated at first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller, setIsProductTypeSelected]);

  useEffect(() => {
    setIsProductTypeSelected(
      controller?.state.values.some((value: FacetValue) => {
        return controller.isValueSelected(value);
      })
    );
    // we can ignore the 'controller' from dependency as we are already updaing the state, whenever there is any change in controller itself
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, setIsProductTypeSelected]);

  if (!state?.values.length) {
    return <></>;
  }

  return (
    <div className="col-span-12 mx-auto mb-l w-full ml:mb-xl ml:w-fit">
      <Headline
        classes="text-theme-text text-sm-s ml:text-center ml:text-s font-heavy mb-m ml:mb-l font-sans"
        useTag="h3"
        fields={{
          headlineText: props.fields?.productTypeHeading ?? { value: '' },
        }}
      />
      <ul className="flex flex-col items-center justify-center gap-y-m gap-x-l ml:flex-row">
        {state?.values.map((value: FacetValue) => {
          return (
            <li key={value.value} className="w-full text-center ml:w-fit">
              <input
                hidden
                type="checkbox"
                id={value.value}
                checked={controller.isValueSelected(value)}
                onChange={() => {
                  controller.toggleSelect(value);
                }}
                disabled={state.isLoading}
                className="hidden"
              />

              <label
                tabIndex={0}
                htmlFor={value.value}
                onKeyDown={(e) => {
                  if (e.code === 'Enter' || e.code === 'Space') {
                    controller.toggleSelect(value);
                  }
                }}
                className={classNames(
                  'block cursor-pointer rounded-[10px] bg-light-gray py-m px-[46px] font-sans text-base font-heavy',
                  controller.isValueSelected(value)
                    ? 'border-6 border-primary'
                    : 'border-2 border-gray  '
                )}
              >
                {value.value}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Custom DropDown Facet for Dimentisons
interface DimensionsFacetProps {
  controller: HeadlessFacet;
  setIsDimensionsSelected: Dispatch<SetStateAction<boolean>>;
  isProductTypeSelected: boolean;
}

type modifiedFacetValue = {
  actualValue: FacetValue;
  width: string;
  height: string;
};

export const DimensionsFacet = (props: DimensionsFacetProps & SizingToolProps) => {
  const { controller, setIsDimensionsSelected, isProductTypeSelected } = props;
  const { facetId } = controller?.state ?? '';

  // states for controller state, widths-heights(decimal) array, selectedwidth, selectedHeight, height dropdown disable state, modified array of facetvalues
  const [state, setState] = useState(controller?.state);
  const [modifiedFacetValues, setModifiedFacetValues] = useState<modifiedFacetValue[]>([]);
  const [widths, setWidths] = useState<string[]>([]);
  const [heights, setHeights] = useState<string[]>([]);
  const [selectedWidth, setSelectedWidth] = useState<string>('');
  const [selectedHeight, setSelectedHeight] = useState<string>('');
  const [heightDropdownDisabled, setHeightDropdownDisabled] = useState(true);

  const isFirstRender = useRef(true);

  useEffect(() => {
    //Timeout to keep dimensionfacet and isProductTypeSelected in sync,
    // need for second useffect when reseting dimension facet
    setTimeout(() => {
      isFirstRender.current = false;
    }, 500);
    const url = window.location.hash;
    const params = new URLSearchParams(url.slice(1));
    const productDimensions = params.get(`f:${facetId}`);
    if (productDimensions) {
      const decodedProductDimensions =
        (productDimensions && decodeURIComponent(productDimensions)) ?? '';
      const [width, height] = decodedProductDimensions.split(' x ');
      setSelectedWidth(fractionToDecimal(width.replace('[', '')));
      setSelectedHeight(fractionToDecimal(height.replace(']', '')));
      setIsDimensionsSelected(true);
      setHeightDropdownDisabled(false);
    }
    // "controller" and "setIsDimensionsSelected" are the coming as props. We can ignore this warning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isProductTypeSelected && !isFirstRender.current) {
      handleResetDimensions();
    }
    // We can ignore the warning for 'handleResetDimentions'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProductTypeSelected]);

  useEffect(() => controller?.subscribe(() => setState(controller?.state)), [controller]);

  useEffect(() => {
    // run useEffect whenever controller state updates
    const extractedWidths: string[] = [];

    // setModifiedFacetValue with actual value, split and convert height-width into decimal

    const _modifiedFacetValues = state?.values?.map((item: FacetValue) => {
      const [width, height] = item.value.split(' x ');

      extractedWidths.push(fractionToDecimal(width));
      return {
        actualValue: { ...item },
        width: fractionToDecimal(width),
        height: fractionToDecimal(height),
      };
    });

    setModifiedFacetValues(_modifiedFacetValues);

    if (selectedWidth !== '') {
      if (!extractedWidths.includes(selectedWidth)) {
        setSelectedWidth('');
        setHeights([]);
        setHeightDropdownDisabled(true);
      }

      const associatedHeights: string[] = _modifiedFacetValues
        .filter(
          (item: modifiedFacetValue) =>
            item.width === selectedWidth && item.actualValue.numberOfResults != 0
        )
        .map((item: modifiedFacetValue) => item.height);

      setHeights(
        associatedHeights
          .filter((item) => item != undefined)
          .sort((a, b) => Number.parseFloat(a) - Number.parseFloat(b))
      );

      if (!associatedHeights.includes(selectedHeight)) {
        toggleSelectedValue(selectedWidth, selectedHeight);
        setSelectedHeight('');
        setIsDimensionsSelected(false);
      }
    }

    // set widths array (decimal values, unique, and sorted)
    setWidths([...new Set(extractedWidths)].sort((a, b) => parseFloat(a) - parseFloat(b)));
    // we can ignore the suggested dependecy, as to accomodate that it will require to refactore whole component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, setIsDimensionsSelected]);

  // handleWidthChange function
  const handleWidthChange = (selectedWidthValue: string) => {
    // invoke toggleSelectValue in every width change
    toggleSelectedValue(selectedWidthValue, selectedHeight);

    setSelectedWidth(selectedWidthValue);

    // when no width selected, disable height dropdown, hide result list, and reset states.
    if (selectedWidthValue === '') {
      setSelectedHeight('');
      setHeightDropdownDisabled(true);
      setIsDimensionsSelected(false);
      setHeights([]);
    } else {
      // Enable the height dropdown and filter the associated heights
      const associatedHeights: string[] = modifiedFacetValues
        .filter(
          (item) => item.width === selectedWidthValue && item.actualValue.numberOfResults != 0
        )
        .map((item) => item.height);

      // when prevSelectedHeight is not included in new associated array, select empty height and hide resultlist
      if (
        selectedHeight != '' &&
        !associatedHeights.includes(selectedHeight) &&
        selectedWidthValue != ''
      ) {
        setSelectedHeight('');
        setIsDimensionsSelected(false);
      }

      setHeightDropdownDisabled(false);
      // set heights array with associatedHeights and sort it.
      setHeights(
        associatedHeights
          .filter((item) => item != undefined)
          .sort((a, b) => parseFloat(a) - parseFloat(b))
      );
    }
  };

  // handle Height Change
  const handleHeightChange = (height: string) => {
    setSelectedHeight(height);
    // deselectAll facet if no height selected
    if (height === '') {
      controller.deselectAll();
      setIsDimensionsSelected(false);
    }
    // if height is selected, invoke toggleSelectedvalue function
    toggleSelectedValue(selectedWidth, height);
  };

  // function to filter modifiedFacetValues against height and width selection,
  // trigger facet selection for the mathcing facet item.
  const toggleSelectedValue = (width: string, height: string) => {
    if (width != '' && height != '') {
      const matchingItem = modifiedFacetValues.find((item) => {
        return item.width === width && item.height === height;
      });

      if (matchingItem) {
        controller.toggleSingleSelect(matchingItem.actualValue);
        setIsDimensionsSelected(true);
      } else {
        controller.deselectAll();
        setIsDimensionsSelected(false);
      }
    }
  };

  // function to handle reset dimensionFacet
  const handleResetDimensions = () => {
    controller.deselectAll();
    setIsDimensionsSelected(false);
    handleHeightChange('');
    handleWidthChange('');
  };

  return (
    <>
      <div className="col-span-12 mb-m ml:mb-l">
        <Headline
          classes="text-theme-text text-sm-s ml:text-center ml:text-s font-heavy mb-xxs ml:mb-s font-sans"
          useTag="h3"
          fields={{
            headlineText: props.fields?.productDimensionsHeading ?? { value: '' },
          }}
        />
        <BodyCopy
          classes="text-left ml:text-center font-regular [&_.body-copy]:text-small! font-serif!"
          fields={{
            body: props.fields?.productDimensionsDescription ?? {
              value: '',
            },
          }}
        />
      </div>

      <div className="col-span-12 mb-m grid grid-cols-1 gap-x-s gap-y-m ml:col-span-9 ml:col-start-4 ml:mb-l ml:grid-cols-3">
        <div className="relative">
          <label
            htmlFor="width"
            className={classNames('block font-serif text-body font-regular', {
              'text-gray': !isProductTypeSelected,
            })}
          >
            <Text field={props.fields?.widthLabel} />
          </label>
          <select
            id="width"
            disabled={!isProductTypeSelected}
            onChange={(e) => handleWidthChange(e.target.value)}
            value={selectedWidth}
            className="block w-full cursor-pointer appearance-none border border-gray bg-none py-xs pl-xxs pr-xs text-sm-xs text-theme-text disabled:cursor-not-allowed disabled:border-gray disabled:text-gray"
          >
            <option value="">{props.fields?.widthPlaceholderText.value}</option>
            {widths.map((width, index) => (
              <option key={`${width}_${index}`} value={width}>
                {decimalToFraction(width) + '"'}
              </option>
            ))}
          </select>
          <SvgIcon
            icon="dropdown-arrow"
            className={classNames('absolute bottom-[20px] right-[12px] z-0', {
              'text-gray': !isProductTypeSelected,
            })}
          />
        </div>

        <div className="relative">
          <label
            htmlFor="height"
            className={classNames('block font-serif text-body font-regular', {
              'text-gray': heightDropdownDisabled,
            })}
          >
            <Text field={props.fields?.heightLabel} />
          </label>
          <select
            id="height"
            disabled={!isProductTypeSelected || heightDropdownDisabled}
            onChange={(e) => handleHeightChange(e.target.value)}
            value={selectedHeight}
            className="block w-full cursor-pointer border border-gray bg-none py-xs pl-xxs pr-xs text-sm-xs text-theme-text disabled:cursor-not-allowed disabled:border-gray disabled:text-gray"
          >
            <option value="">{props.fields?.heightPlaceholderText.value}</option>
            {heights.map((height, index) => (
              <option key={`${height}_${index}`} value={height}>
                {decimalToFraction(height) + '"'}
              </option>
            ))}
          </select>
          <SvgIcon
            icon="dropdown-arrow"
            className={classNames('absolute bottom-[20px] right-[12px] z-0', {
              'text-gray': heightDropdownDisabled,
            })}
          />
        </div>

        {selectedHeight !== '' && (
          <button
            onClick={() => handleResetDimensions()}
            className="mt-xs flex h-fit w-fit items-center ml:mt-auto ml:pb-xs"
          >
            <span className="text-center font-sans text-button font-demi">
              <Text field={props.fields?.resetLabel} />
            </span>
            <svg
              role="img"
              width="14"
              height="16"
              viewBox="0 0 14 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-xxs inline-block"
            >
              <title>Reset icon</title>
              <path
                d="M11.9425 3.05363C10.6729 1.78409 8.93058 0.996094 6.99562 0.996094C3.1257 0.996094 0 4.13055 0 8.00047C0 11.8704 3.1257 15.0048 6.99562 15.0048C10.2614 15.0048 12.9844 12.7722 13.7636 9.75157H11.9425C11.2245 11.7916 9.2808 13.2538 6.99562 13.2538C4.09756 13.2538 1.74234 10.8985 1.74234 8.00047C1.74234 5.10241 4.09756 2.74719 6.99562 2.74719C8.44903 2.74719 9.74484 3.35132 10.6904 4.30566L7.87117 7.12492H14V0.996094L11.9425 3.05363Z"
                fill="black"
              />
            </svg>
          </button>
        )}
      </div>
    </>
  );
};
