import clsx from 'clsx';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import { ChangeEvent, JSX, useMemo, useState } from 'react';

import { MultiGlideSizingCalculatorActionButtons } from './ActionButtons.helper';

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
        selectedConfigurationOption: OPTIONS.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (item: any) => item.value === selectedOption
        ),
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
          {OPTIONS.map((item, idx) => (
            <div
              className={clsx({
                'my-5 mb-4 flex items-center rounded-[5px]  bg-[#F8F6F4] p-5': true,
                'border-6 border-[#F26924]': selectedOption === item.value,
                'border border-[#C4BFB6] hover:border-2 hover:border-black':
                  selectedOption !== item.value,
              })}
              key={item.value}
            >
              <label
                htmlFor={`step-one-radio-${idx}`}
                className="text-md text-gray-900  dark:text-gray-300 flex h-full w-full cursor-pointer flex-col items-center text-center font-bold uppercase"
              >
                <ImageWrapper
                  image={item.image}
                  additionalMobileClasses=" mr-2"
                  additionalDesktopClasses="mt-4 w-full"
                />
                <div className="flex flex-col items-center justify-center">
                  <input
                    id={`step-one-radio-${idx}`}
                    type="radio"
                    value={item.value}
                    name={item.value}
                    className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 hidden h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    checked={selectedOption === item.value}
                    onChange={handleChangeRadioInput}
                  />
                  <div>{item.title}</div>
                  <div className="mt-2 text-[14px] text-dark-gray">{item.description}</div>
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
