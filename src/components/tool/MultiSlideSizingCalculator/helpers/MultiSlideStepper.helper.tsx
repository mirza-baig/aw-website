import classNames from 'classnames';
import { JSX, useState } from 'react';
import { FiCheck } from 'react-icons/fi';

/* eslint-disable @typescript-eslint/no-explicit-any */
const Stepper = ({ isComplete, activeStep }: any): JSX.Element => {
  const [] = useState(false);

  const activeButtonStyle =
    'm-0 flex h-[40px] w-[40px] cursor-default items-center justify-center rounded-full border-2 border-[#F26924] bg-white p-0';
  const completedButtonStyle =
    'm-0 flex h-[40px] w-[40px] cursor-default items-center justify-center rounded-full border-2 border-[#F26924] bg-[#F26924] p-0';
  const inactiveButtonStyle =
    'm-0 flex h-[40px] w-[40px] cursor-default items-center justify-center rounded-full border-2 border-[#C4BFB6] bg-white p-0';

  return (
    <div className="mt-5 bg-[#F8F6F4] pt-2">
      <div className="flex flex-row p-[16px] pb-[19px]">
        <div className="relative flex-1 pl-2 pr-2">
          <div className="flex flex-col items-center">
            <div className="w-full">
              <span className="mb-2 block text-center font-sans text-button font-semibold">
                Step One
              </span>
            </div>
            <button
              type="button"
              className={classNames(
                activeStep === 0 ? activeButtonStyle : '',
                activeStep > 0 ? completedButtonStyle : ''
              )}
            >
              <span className={activeStep > 0 ? 'hidden' : 'font-sans text-button font-heavy'}>
                1
              </span>
              {activeStep > 0 && <FiCheck size={24} />}
            </button>
          </div>
        </div>
        <div className="relative flex-1 pl-2 pr-2">
          <div className="absolute left-[calc((-50%+4em)-32px)] right-[calc((50%+4em)-32px)] top-[calc((6em-2px)/2)]">
            <span
              className={
                activeStep > 0
                  ? 'block border-t-2 border-[#F26924]'
                  : 'block border-t-2 border-[#C4BFB6]'
              }
            ></span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full">
              <span className="mb-2 block text-center font-sans text-button font-semibold">
                Step Two
              </span>
            </div>
            <button
              type="button"
              className={classNames(
                activeStep === 1 ? activeButtonStyle : '',
                activeStep < 1 ? inactiveButtonStyle : '',
                activeStep > 1 ? completedButtonStyle : ''
              )}
            >
              <span className={activeStep > 1 ? 'hidden' : 'font-sans text-button font-heavy'}>
                2
              </span>
              {activeStep > 1 && <FiCheck size={24} />}
            </button>
          </div>
        </div>
        <div className="relative flex-1 pl-2 pr-2">
          <div className="absolute left-[calc((-50%+4em)-32px)] right-[calc((50%+4em)-32px)] top-[calc((6em-2px)/2)]">
            <span
              className={
                activeStep > 1
                  ? 'block border-t-2 border-[#F26924]'
                  : 'block border-t-2 border-[#C4BFB6]'
              }
            ></span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full">
              <span className="mb-2 block text-center font-sans text-button font-semibold">
                Step Three
              </span>
            </div>
            <button
              type="button"
              className={classNames(
                activeStep === 2 ? activeButtonStyle : '',
                isComplete ? completedButtonStyle : '',
                activeStep < 2 ? inactiveButtonStyle : ''
              )}
            >
              <span className={isComplete ? 'hidden' : 'font-sans text-button font-heavy'}>3</span>
              {isComplete && <FiCheck size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
