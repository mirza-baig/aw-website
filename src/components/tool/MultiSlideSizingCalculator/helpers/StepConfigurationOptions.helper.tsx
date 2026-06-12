import clsx from 'clsx';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import { ChangeEvent, JSX, useMemo, useState } from 'react';

import { MultiSlideSizingCalculatorActionButtons } from './MultiSlideActionButtons.helper';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StepConfigurationOption = (props: any): JSX.Element => {
  const { fields, activeStep } = props;

  const OPTIONS = [
    {
      title: fields?.StepOneTitle1.value,
      value: fields?.StepOneTitle1.value.toLowerCase(),
      image: fields?.StepOneButtonImage1,
      description: fields?.StepOneDescription1.value,
    },
    {
      title: fields?.StepOneTitle2.value,
      value: fields?.StepOneTitle2.value.toLowerCase(),
      image: fields?.StepOneButtonImage2,
      description: fields?.StepOneDescription2.value,
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
        selectedConfigurationOption: OPTIONS.find((item) => item.value === selectedOption),
        downloadLink:
          selectedOption === 'stacking'
            ? fields?.StackingDownLoadLink?.value
            : fields?.PocketingDownLoadLink?.value,
      });
    }
  };

  return (
    <div className="flex flex-col items-center md:items-start">
      <div className="w-full">
        <div className="font-extrabold">Step One: Select Configuration Option</div>
        <div className="flex flex-col md:flex-row md:space-x-5">
          {OPTIONS.map((item) => (
            <div
              key={item.value}
              className={clsx({
                'my-5 flex items-center rounded-[5px] bg-[#F8F6F4] p-5': true,
                'border-6 border-[#F26924]': selectedOption === item.value,
                'border border-[#C4BFB6] hover:border-2 hover:border-black':
                  selectedOption !== item.value,
              })}
            >
              <label
                htmlFor={`step-one-radio-${item.value}`}
                className="text-md dark:text-gray-300 flex h-full w-full cursor-pointer flex-col items-center justify-between text-center font-bold uppercase text-black"
              >
                <ImageWrapper
                  image={item.image}
                  additionalMobileClasses="mr-2"
                  additionalDesktopClasses="mt-4 w-full"
                />
                <div className="flex flex-col items-center justify-center">
                  <input
                    id={`step-one-radio-${item.value}`}
                    type="radio"
                    value={item.value}
                    name="step-one-radio"
                    checked={selectedOption === item.value}
                    onChange={handleChangeRadioInput}
                    className="hidden h-4 w-4 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="text-bold text-[18px]">{item.title}</div>
                  <div className="mt-2 text-[14px] text-dark-gray">{item.description}</div>
                </div>
              </label>
            </div>
          ))}
        </div>

        <div className="m-auto mt-5">
          <MultiSlideSizingCalculatorActionButtons {...props} nextStep={handleClickNext} />
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
