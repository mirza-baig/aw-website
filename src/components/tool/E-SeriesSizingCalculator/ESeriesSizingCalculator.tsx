'use client';

import classNames from 'classnames';
import Component from 'helpers/Component/Component';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import ModalWrapper from 'helpers/ModalWrapper/ModalWrapper';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import { ChangeEvent, JSX, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useReactToPrint } from 'react-to-print';

import { ESeriesSizingCalculatorTheme } from './helpers/ESeriesSizingCalculator.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type ESeriesSizingCalculatorProps =
  Sitecore.Components.Tool.ESeriesSizingCalculator.ESeriesSizingCalculator;

type CalcForm = {
  calcUsing: string; //known_size
  width: string; //ew
  height: string; //eh
  shimSpace: string; //ss
  sealantGap: string; //sg
  casingSize: string; //casing_size
  casingSizeCustom: string; //ccs
  sillNosing: string; //sill_nosing
  sillNosingCustom: string; //csns
};

function ESeriesSizingCalculator_Default(props: ESeriesSizingCalculatorProps): JSX.Element {
  const { themeData } = useTheme(ESeriesSizingCalculatorTheme());
  const isEE = useExperienceEditor();
  const componentRef = useRef<HTMLDivElement | null>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'My Document',
  });

  //Modal settings
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);

  //Calculator values
  const [casingDimensionWidth, setCasingDimensionWidth] = useState<string>();
  const [casingDimensionHeight, setCasingDimensionHeight] = useState<string>();
  const [overallUnitSizeWidth, setOverallUnitSizeWidth] = useState<string>();
  const [overallUnitSizeHeight, setOverallUnitSizeHeight] = useState<string>();
  const [roughOpeningWidth, setRoughOpeningWidth] = useState<string>();
  const [roughOpeningHeight, setRoughOpeningHeight] = useState<string>();
  const [masonryOpeningWidth, setMasonryOpeningWidth] = useState<string>();
  const [masonryOpeningHeight, setMasonryOpeningHeight] = useState<string>();

  //Options selected values
  const [calcUsingText, setCalcUsingText] = useState<string>('Overall Unit Size');
  const [widthText, setWidthText] = useState<string>();
  const [heightText, setHeightText] = useState<string>();
  const [shimSpaceText, setShimSpaceText] = useState<string>();
  const [sealantGapText, setSealantGapText] = useState<string>();
  const [casingSizeText, setCasingSizeText] = useState<string>('None');
  const [casingSizeCustomText, setCasingSizeCustomText] = useState<string>();
  const [sillNosingText, setSillNosingText] = useState<string>('No Sill Nosing');
  const [sillNosingCustomText, setSillNosingCustomText] = useState<string>();

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<CalcForm>({
    mode: 'onChange',
    defaultValues: {
      calcUsing: '2',
      shimSpace: '0.25',
      sealantGap: '0.25',
      casingSize: '0',
      width: '',
      height: '',
      casingSizeCustom: '',
      sillNosing: '2',
      sillNosingCustom: '',
    },
  });

  // Used to enable/disable the custom text fields
  const [casingSizeWatch, setCasingSizeWatch] = useState<string>('0');
  const [sillNosingWatch, setSillNosingWatch] = useState<string>('2');

  const clearCalculations = () => {
    setCasingDimensionWidth('-');
    setCasingDimensionHeight('-');
    setMasonryOpeningHeight('-');
    setMasonryOpeningWidth('-');
    setOverallUnitSizeHeight('-');
    setOverallUnitSizeWidth('-');
    setRoughOpeningHeight('-');
    setRoughOpeningWidth('-');
  };

  const handleCalcUsingChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const calcUsingText = event.target[event.target.selectedIndex].innerHTML;

    clearCalculations();
    setCalcUsingText(calcUsingText);
  };

  const handleCasingSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const profiledCasingValue = event.target.value;
    const casingSizeText = event.target[event.target.selectedIndex].innerHTML;

    clearCalculations();
    resetField('casingSizeCustom');
    setCasingSizeWatch(profiledCasingValue);
    setCasingSizeText(casingSizeText);
  };

  const handleSillNosingChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const sillNosingValue = event.target.value;
    const sillNosingText = event.target[event.target.selectedIndex].innerHTML;

    clearCalculations();
    resetField('sillNosingCustom');
    setSillNosingWatch(sillNosingValue);
    setSillNosingText(sillNosingText);
  };

  const openModal = (index: number) => {
    setIsLightboxVisible(true);
    setCurrentImageIndex(index);
  };

  const resetForm = () => {
    //Clear results table
    setCasingDimensionWidth('-');
    setCasingDimensionHeight('-');
    setMasonryOpeningHeight('-');
    setMasonryOpeningWidth('-');
    setOverallUnitSizeHeight('-');
    setOverallUnitSizeWidth('-');
    setRoughOpeningHeight('-');
    setRoughOpeningWidth('-');

    //Clear options selected table
    setCalcUsingText('Overall Unit Size');
    setWidthText('-');
    setHeightText('-');
    setShimSpaceText('-');
    setSealantGapText('-');
    setCasingSizeText('None');
    setCasingSizeCustomText('-');
    setSillNosingText('No Sill Nosing');
    setSillNosingCustomText('-');

    // Reset form fields
    resetField('calcUsing');
    resetField('width');
    resetField('height');
    resetField('shimSpace');
    resetField('sealantGap');
    resetField('casingSize');
    resetField('casingSizeCustom');
    resetField('sillNosing');
    resetField('sillNosingCustom');

    // Reset watches
    setCasingSizeWatch('0');
    setSillNosingWatch('2');
  };

  const onSubmit = (data: CalcForm) => {
    const jsonData = JSON.stringify(data, null, 2);
    const jsonObj = JSON.parse(jsonData);

    // Options selected
    setWidthText(jsonObj.width);
    setHeightText(jsonObj.height);
    setShimSpaceText(jsonObj.shimSpace);
    setSealantGapText(jsonObj.sealantGap);
    setCasingSizeCustomText(jsonObj.casingSizeCustom);
    setSillNosingCustomText(jsonObj.sillNosingCustom);

    // Calculations - Copied from legacy solution
    const known_size = Number(jsonObj.calcUsing);
    const sill_nosing = Number(jsonObj.sillNosing);
    const casing_size = Number(jsonObj.casingSize);

    const ew = Number(jsonObj.width);
    const eh = Number(jsonObj.height);
    let ss = Number(jsonObj.shimSpace) * 2;
    let sg = Number(jsonObj.sealantGap) * 2;
    let csns = Number(jsonObj.sillNosingCustom);
    const ccs = Number(jsonObj.casingSizeCustom);
    const sno = Number(jsonObj.sillNosingCustom) * -1;

    const cs = casing_size < 99 ? casing_size : ccs;
    const sh = -1.125;

    let csw = 0;
    let csh = 0;
    let mw = 0;
    let mh = 0;
    let uw = 0;
    let uh = 0;

    if (sill_nosing > 1 && sill_nosing < 3) {
      csh = cs;
    } else if (sill_nosing > 3 && sill_nosing < 5) {
      csh = cs - sh;
    } else if (sill_nosing > 5 && sill_nosing < 7) {
      csh = cs * 2;
    } else {
      csns = csns * -1;
      csh = cs - csns;
    }

    if (known_size > 1 && known_size < 3) {
      uw = ew;
      uh = eh;
    } else if (known_size > 3 && known_size < 5) {
      uw = ew - ss;
      uh = eh - ss;
    } else if (known_size > 5 && known_size < 7) {
      uw = ew - cs * 2;
      uh = eh - csh;
    } else if (known_size > 7 && known_size < 9) {
      uw = ew - cs * 2 - sg;
      uh = eh - csh - sg;
    }

    csw = cs * 2;
    csw = csw * -1;
    csh = csh * -1;

    const cw = uw - csw;
    const ch = uh - csh;

    setCasingDimensionWidth(cw.toString());
    setCasingDimensionHeight(ch.toString());

    if (casing_size < 0.001) {
      setCasingDimensionWidth('-');
      if ((sill_nosing > 1 && sill_nosing < 3) || (sill_nosing > 5 && sill_nosing < 7)) {
        setCasingDimensionHeight('-');
      }
    }

    ss = ss * -1;
    const rw = uw - ss;
    const rh = uh - ss;

    setOverallUnitSizeWidth(uw.toString());
    setOverallUnitSizeHeight(uh.toString());
    setRoughOpeningWidth(rw.toString());
    setRoughOpeningHeight(rh.toString());

    sg = sg * -1;
    mw = cw - sg;
    setMasonryOpeningWidth(mw.toString());

    if (casing_size < 0.001) {
      if (sill_nosing > 7) {
        mh = uh - sg - sno;
      } else {
        mh = ch - sg;
      }
    } else {
      mh = ch - sg;
    }
    setMasonryOpeningHeight(mh.toString());
  };

  if (!props.fields) {
    return <></>;
  }

  return (
    <Component variant="lg" dataComponent="tool/eseriessizingcalculator" {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="col-span-12">
        <div className={themeData.classes.formWrapper}>
          <div className={themeData.classes.columnSpan2}>
            <label className={themeData.classes.labelClass} htmlFor="calcUsing">
              Calculate using known
            </label>
            <select
              id="calcUsing"
              className={themeData.classes.selectColumnSpan2}
              {...register('calcUsing')}
              onChange={handleCalcUsingChange}
            >
              <option value="2">Overall Unit Size</option>
              <option value="4">Rough Opening</option>
              <option value="6">Casing Size</option>
              <option value="8">Masonry Opening</option>
            </select>
          </div>
          <div className={themeData.classes.columnSpan1}>
            <label className={themeData.classes.labelClass} htmlFor="width">
              Width (in inches)*
            </label>
            <input
              id="width"
              type="text"
              placeholder="Width"
              maxLength={25}
              onInput={clearCalculations}
              className={`${
                errors.width ? themeData.classes.errorInvalid : themeData.classes.errorValid
              }`}
              {...register('width', {
                required: 'This field is required.',
                pattern: {
                  value: /^(\d*[1-9]\d*(\.\d+)?|0*\.\d*[1-9]\d*)$/,
                  message: 'Please enter a valid number.',
                },
              })}
            ></input>
            {errors.width && <div className="text-body text-error">{errors.width.message}</div>}
            <div className={themeData.classes.labelClass}>
              <span className={themeData.classes.helpText}>For help, refer to our</span>
              <button
                className={themeData.classes.modalLinkButton}
                type="button"
                onClick={() => {
                  openModal(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    openModal(0);
                  }
                }}
              >
                {props.fields?.fractionChartLinkText.value}
              </button>
            </div>
            {currentImageIndex === 0 && isLightboxVisible && (
              <ModalWrapper
                isModalOpen={currentImageIndex === 0 && isLightboxVisible}
                size="fluid"
                handleClose={() => setIsLightboxVisible(false)}
              >
                <div className="px-ml pb-ml pt-s">
                  <ImageWrapper
                    imageLayout="intrinsic"
                    image={{
                      value: {
                        src: props.fields?.fractionChartImage?.value.src ?? '',
                        alt: props.fields?.fractionChartImage?.value.alt ?? '',
                        width: props.fields?.fractionChartImage?.value.width ?? 549,
                        height: props.fields?.fractionChartImage?.value.height ?? 123,
                      },
                    }}
                  />
                </div>
              </ModalWrapper>
            )}
          </div>
          <div className={themeData.classes.columnSpan1}>
            <label className={themeData.classes.labelClass} htmlFor="height">
              Height (in inches)*
            </label>
            <input
              id="height"
              type="text"
              placeholder="Height"
              maxLength={25}
              onInput={clearCalculations}
              className={`${
                errors.height ? themeData.classes.errorInvalid : themeData.classes.errorValid
              }`}
              {...register('height', {
                required: 'This field is required.',
                pattern: {
                  value: /^(\d*[1-9]\d*(\.\d+)?|0*\.\d*[1-9]\d*)$/,
                  message: 'Please enter a valid number.',
                },
              })}
            ></input>
            {errors.height && <div className="text-body text-error">{errors.height.message}</div>}
          </div>
          <div className={themeData.classes.columnSpan1}>
            <label className={themeData.classes.labelClass} htmlFor="shimSpace">
              Shim Space (in inches)*
            </label>
            <input
              id="shimSpace"
              type="text"
              placeholder="Shim Space"
              maxLength={25}
              onInput={clearCalculations}
              className={`${
                errors.shimSpace ? themeData.classes.errorInvalid : themeData.classes.errorValid
              }`}
              {...register('shimSpace', {
                required: 'This field is required.',
                pattern: {
                  value: /^(\d*[1-9]\d*(\.\d+)?|0*\.\d*[1-9]\d*)$/,
                  message: 'Please enter a valid number.',
                },
              })}
            ></input>
            {errors.shimSpace && (
              <div className="text-body text-error">{errors.shimSpace.message}</div>
            )}
          </div>
          <div className={themeData.classes.columnSpan1}>
            <label className={themeData.classes.labelClass} htmlFor="sealantGap">
              Sealant Gap (in inches)*
            </label>
            <input
              id="sealantGap"
              type="text"
              placeholder="Sealant Gap"
              maxLength={25}
              onInput={clearCalculations}
              className={`${
                errors.sealantGap ? themeData.classes.errorInvalid : themeData.classes.errorValid
              }`}
              {...register('sealantGap', {
                required: 'This field is required.',
                pattern: {
                  value: /^(\d*[1-9]\d*(\.\d+)?|0*\.\d*[1-9]\d*)$/,
                  message: 'Please enter a valid number.',
                },
              })}
            ></input>
            {errors.sealantGap && (
              <div className="text-body text-error">{errors.sealantGap.message}</div>
            )}
          </div>
          <div className={themeData.classes.columnSpan1}>
            <label className={themeData.classes.labelClass} htmlFor="casingSize">
              Profiled Casing
            </label>
            <select
              className={themeData.classes.selectColumnSpan1}
              id="casingSize"
              {...register('casingSize')}
              onChange={handleCasingSizeChange}
            >
              <option value="0">None</option>
              <option value="1.625">A753</option>
              <option value="1.625">A754</option>
              <option value="3.125">A755</option>
              <option value="3.125">A756</option>
              <option value="5.125">A758</option>
              <option value="3.125">A75B</option>
              <option value="100">Custom</option>
            </select>
            <div className={themeData.classes.labelClass}>
              <span className={themeData.classes.helpText}>Show me</span>
              <button
                className={themeData.classes.modalLinkButton}
                type="button"
                onClick={() => {
                  openModal(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    openModal(1);
                  }
                }}
              >
                {props.fields?.casingProfilesLinkText.value}
              </button>
            </div>
            {currentImageIndex === 1 && isLightboxVisible && (
              <ModalWrapper
                isModalOpen={currentImageIndex === 1 && isLightboxVisible}
                size="fluid"
                handleClose={() => setIsLightboxVisible(false)}
              >
                <div className="px-ml pb-ml pt-s">
                  <ImageWrapper
                    imageLayout="intrinsic"
                    image={{
                      value: {
                        src: props.fields?.casingProfilesImage?.value.src ?? '',
                        alt: props.fields?.casingProfilesImage?.value.alt ?? '',
                        width: props.fields?.casingProfilesImage?.value.width ?? 549,
                        height: props.fields?.casingProfilesImage?.value.height ?? 123,
                      },
                    }}
                  />
                </div>
              </ModalWrapper>
            )}
          </div>
          <div className={themeData.classes.columnSpan1}>
            <label
              className={classNames(
                themeData.classes.labelClass,
                casingSizeWatch === '100' ? '' : 'text-dark-gray'
              )}
              htmlFor="casingSizeCustom"
            >
              Casing Size <span hidden={casingSizeWatch !== '100'}>*</span>
            </label>
            <input
              id="casingSizeCustom"
              type="text"
              placeholder="Casing Size"
              maxLength={25}
              disabled={casingSizeWatch !== '100'}
              onInput={clearCalculations}
              className={`${
                errors.casingSizeCustom
                  ? themeData.classes.errorInvalid
                  : themeData.classes.errorValid
              }`}
              {...register('casingSizeCustom', {
                required: {
                  value: casingSizeWatch === '100',
                  message: 'This field is required.',
                },
                pattern: {
                  value: /^(\d*[1-9]\d*(\.\d+)?|0*\.\d*[1-9]\d*)$/,
                  message: 'Please enter a valid number.',
                },
              })}
            ></input>
            {errors.casingSizeCustom && (
              <div className="text-body text-error">{errors.casingSizeCustom.message}</div>
            )}
          </div>
          <div className={themeData.classes.columnSpan1}>
            <label className={themeData.classes.labelClass} htmlFor="sillNosing">
              Sill Nosing
            </label>
            <select
              className={themeData.classes.selectColumnSpan1}
              id="sillNosing"
              {...register('sillNosing')}
              onChange={handleSillNosingChange}
            >
              <option value="2">No Sill Nosing</option>
              <option value="4">A751 or A752</option>
              <option value="6">Casing 4 Sides</option>
              <option value="8">Custom Sill Nosing</option>
            </select>
          </div>
          <div className={themeData.classes.columnSpan1}>
            <label
              className={classNames(
                themeData.classes.labelClass,
                sillNosingWatch === '8' ? '' : 'text-dark-gray'
              )}
              htmlFor="sillNosingCustom"
            >
              Sill Nosing Size <span hidden={sillNosingWatch !== '8'}>*</span>
            </label>
            <input
              id="sillNosingCustom"
              type="text"
              placeholder="Sill Nosing Size"
              maxLength={25}
              disabled={sillNosingWatch !== '8'}
              onInput={clearCalculations}
              className={`${
                errors.sillNosingCustom
                  ? themeData.classes.errorInvalid
                  : themeData.classes.errorValid
              }`}
              {...register('sillNosingCustom', {
                required: {
                  value: sillNosingWatch === '8',
                  message: 'This field is required.',
                },
                pattern: {
                  value: /^(\d*[1-9]\d*(\.\d+)?|0*\.\d*[1-9]\d*)$/,
                  message: 'Please enter a valid number.',
                },
              })}
            ></input>
            {errors.sillNosingCustom && (
              <div className="text-body text-error">{errors.sillNosingCustom.message}</div>
            )}
          </div>
          {/* Submit section */}
          <div className={themeData.classes.submitWrapper}>
            <button type="submit" className={themeData.classes.submitButton}>
              Calculate
            </button>
            <button type="button" onClick={resetForm} className={themeData.classes.resetButton}>
              Reset calculator{' '}
              <span className="ml-xxs">
                <SvgIcon icon="reset" />
              </span>
            </button>
          </div>
        </div>
      </form>

      <div className="col-span-12 flex flex-row items-center justify-between">
        <div className="mb-s font-sans text-sm-m font-heavy leading-[30px] text-theme-text last:mb-0 md:leading-normal lg:text-m">
          <h2>Results:</h2>
        </div>
        <div className="mb-s hidden items-end pr-2 md:relative md:block">
          <div>
            <button
              type="button"
              className={themeData.classes.printButton}
              onClick={reactToPrintFn}
            >
              <span className="mr-xxs text-darkprimary">
                <SvgIcon icon="print" />
              </span>
              {'Print'}
            </button>
            <div ref={componentRef}></div>
          </div>
        </div>
      </div>
      <div className={themeData.classes.resultsOutputWrapper} id="resultsOutput" ref={componentRef}>
        <div className={themeData.classes.printHeaderDiv}>
          <h2>E-Series Sizing Calculator Results</h2>
        </div>
        <div className={themeData.classes.columnSpan1}>
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                {/* Options Selected Table */}
                <table className="min-w-full font-sans text-sm font-light">
                  <thead className={themeData.classes.tableHead}>
                    <tr>
                      <th colSpan={2} scope="col" className={themeData.classes.thLeft}>
                        Options Selected
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={themeData.classes.tableRow}>
                      <td className={themeData.classes.tdColumn}>Calculate Using Known</td>
                      <td className={themeData.classes.tdColumnCenter}>{calcUsingText}</td>
                    </tr>
                    <tr className={themeData.classes.tableRow}>
                      <td className={themeData.classes.tdColumn}>Width (in inches)</td>
                      <td className={themeData.classes.tdColumnCenter}>{widthText}</td>
                    </tr>
                    <tr className={themeData.classes.tableRow}>
                      <td className={themeData.classes.tdColumn}>Height (in inches)</td>
                      <td className={themeData.classes.tdColumnCenter}>{heightText}</td>
                    </tr>
                    <tr className={themeData.classes.tableRow}>
                      <td className={themeData.classes.tdColumn}>Shim Space (in inches)</td>
                      <td className={themeData.classes.tdColumnCenter}>{shimSpaceText}</td>
                    </tr>
                    <tr className={themeData.classes.tableRow}>
                      <td className={themeData.classes.tdColumn}>Sealant Gap (in inches)</td>
                      <td className={themeData.classes.tdColumnCenter}>{sealantGapText}</td>
                    </tr>
                    <tr className={themeData.classes.tableRow}>
                      <td className={themeData.classes.tdColumn}>Profiled Casing</td>
                      <td className={themeData.classes.tdColumnCenter}>{casingSizeText}</td>
                    </tr>
                    <tr className={themeData.classes.tableRow}>
                      <td className={themeData.classes.tdColumn}>Casing Size</td>
                      <td className={themeData.classes.tdColumnCenter}>{casingSizeCustomText}</td>
                    </tr>
                    <tr className={themeData.classes.tableRow}>
                      <td className={themeData.classes.tdColumn}>Sill Nosing</td>
                      <td className={themeData.classes.tdColumnCenter}>{sillNosingText}</td>
                    </tr>
                    <tr className={themeData.classes.tableRow}>
                      <td className={themeData.classes.tdColumn}>Sill Nosing Size</td>
                      <td className={themeData.classes.tdColumnCenter}>{sillNosingCustomText}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className={themeData.classes.columnSpan1}>
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                {/* Calculated Dimensions Table */}
                <table className="min-w-full font-sans text-sm font-light ">
                  <thead className={themeData.classes.tableHead}>
                    <tr>
                      <th scope="col" className={themeData.classes.thLeft}>
                        Calculated Dimensions
                      </th>
                      <th scope="col" className={themeData.classes.thCenter}>
                        Width
                      </th>
                      <th scope="col" className={themeData.classes.thRight}>
                        Height
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={themeData.classes.tableRow}>
                      <td className={themeData.classes.tdColumn}>Overall Unit Size</td>
                      <td className={themeData.classes.tdColumnCenter}>{overallUnitSizeWidth}</td>
                      <td className={themeData.classes.tdColumnCenter}>{overallUnitSizeHeight}</td>
                    </tr>
                    <tr className={themeData.classes.tableRow}>
                      <td className={themeData.classes.tdColumn}>Rough Opening</td>
                      <td className={themeData.classes.tdColumnCenter}>{roughOpeningWidth}</td>
                      <td className={themeData.classes.tdColumnCenter}>{roughOpeningHeight}</td>
                    </tr>
                    <tr className={themeData.classes.tableRow}>
                      <td className={themeData.classes.tdColumn}>Casing Dimensions</td>
                      <td className={themeData.classes.tdColumnCenter}>{casingDimensionWidth}</td>
                      <td className={themeData.classes.tdColumnCenter}>{casingDimensionHeight}</td>
                    </tr>
                    <tr className={themeData.classes.tableRow}>
                      <td className={themeData.classes.tdColumn}>Masonry Opening</td>
                      <td className={themeData.classes.tdColumnCenter}>{masonryOpeningWidth}</td>
                      <td className={themeData.classes.tdColumnCenter}>{masonryOpeningHeight}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {(props.fields?.footer || isEE) && (
        <div className="col-span-12">
          <RichTextWrapper field={props.fields?.footer} className={themeData.classes.footer} />
        </div>
      )}
    </Component>
  );
}

export const Default = withDatasourceCheck(ESeriesSizingCalculator_Default);
