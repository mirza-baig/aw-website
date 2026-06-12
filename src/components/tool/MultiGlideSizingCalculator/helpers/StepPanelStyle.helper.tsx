import clsx from 'clsx';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import { ChangeEvent, JSX, useMemo, useState } from 'react';

import { MultiGlideSizingCalculatorActionButtons } from './ActionButtons.helper';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StepPanelStyle = (props: any): JSX.Element => {
  const { fields, activeStep } = props;

  const OPTIONS = [
    {
      text: fields?.PanelStyleText1?.value,
      image: fields?.PanelStyleImage1,
      name: 'contemporary_cap',
    },
    {
      text: fields?.PanelStyleText2?.value,
      image: fields?.PanelStyleImage2,
      name: 'contemporary_ccp',
    },
    {
      text: fields?.PanelStyleText3?.value,
      image: fields?.PanelStyleImage3,
      name: 'traditional',
    },
  ];

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useMemo(() => {
    if (props.isResetForm) {
      setSelectedOption(null);
    }
  }, [props.isResetForm]);

  const handleChangeRadioInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleClickNext = () => {
    if (selectedOption === null) {
      setError('Select an option');
    } else {
      setError(null);
      props.onStepChange(activeStep + 1);
      props.userCallback({
        selectedPanelStyle: OPTIONS.find((item) => item.name === selectedOption),
      });
    }
  };
  return (
    <div className="flex flex-col items-center md:items-start">
      <div className="w-full">
        <div className="font-extrabold">Step Two: Select Panel Style</div>
        <div className="font-bold">{fields?.StepTwoTitle?.value}</div>
        <div className="mt-5 flex flex-col md:flex-row md:space-x-5">
          {OPTIONS.map((item, idx) => (
            <div
              className={clsx({
                'my-5 mb-4 flex items-center rounded-[5px] bg-[#F8F6F4] p-5 font-semibold md:max-w-[280px]': true,
                'border-6 border-[#F26924]': selectedOption === item.name,
                'border border-[#C4BFB6] hover:border-2 hover:border-black':
                  selectedOption !== item.name,
              })}
              key={item.name}
            >
              <label
                htmlFor={`step-two-radio-${idx}`}
                className="text-md text-gray-900 ml-2  flex h-full w-full cursor-pointer flex-row items-start text-center font-bold uppercase md:h-full md:flex-col md:justify-between"
              >
                <ImageWrapper
                  image={item.image}
                  additionalMobileClasses="w-20 h-20 mr-2 hidden"
                  additionalDesktopClasses="mb-4 w-full"
                />
                <div className="flex items-start justify-center md:items-center">
                  <input
                    id={`step-two-radio-${idx}`}
                    type="radio"
                    value={item.name}
                    name={item.name}
                    className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-6 w-6 text-[#F26924] focus:ring-2 focus:ring-[#F26924] dark:focus:ring-[#b9b9b9] md:hidden"
                    checked={selectedOption === item.name}
                    onChange={handleChangeRadioInput}
                  />
                  <span className="text-bold ml-2.5 text-[18px] md:ml-0">{item.text}</span>
                </div>
              </label>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <MultiGlideSizingCalculatorActionButtons {...props} nextStep={handleClickNext} />
          {error && (
            <div className="float-right px-m py-3 font-semibold text-red-500 md:float-left md:px-0">
              {error}
            </div>
          )}
        </div>
        <div className="m-auto mt-[50px]"></div>
      </div>
    </div>
  );
};
