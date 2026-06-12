'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { Spinner } from 'helpers/Spinner';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import React from 'react';

import { Answer, Question } from './StormDoorChooseTool.helper';

type AnswersUIProps = {
  answersDataRes: Answer[];
  questionDataQuestionText?: string;
  errorText?: string;
  showErrorText: boolean;
  nextID?: string;
  allQuestionID: Question[];
  onSelectAnswer: (id: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLoading: boolean;
  answersError?: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: any;
};

export const AnswersUI = React.memo(function AnswersUI({
  answersDataRes,
  questionDataQuestionText,
  errorText,
  showErrorText,
  nextID,
  allQuestionID,
  onSelectAnswer,
  onNext,
  onPrevious,
  isLoading,
  answersError,
  fields,
}: AnswersUIProps) {
  return (
    <>
      <div className="mt-s mb-xxs text-center font-sans text-sm-s font-heavy ml:mt-l ml:text-s">
        <Text field={{ value: questionDataQuestionText }} />
      </div>

      {answersError && (
        <div className="flex min-h-50 w-full items-center justify-center text-center font-sans text-sm-m font-medium md:text-s">
          We&apos;re sorry, we couldn&apos;t process your request at this time.
          <br />
          Please refresh or try again later.
        </div>
      )}

      {isLoading && (
        <div className="loader flex min-h-50 w-full items-center justify-center">
          <Spinner size={48} />
        </div>
      )}

      {answersDataRes && !answersError && (
        <div className="mt-s flex min-h-50 w-full justify-center">
          <div className="grid w-full grid-cols-2 justify-center gap-3 p-1 pb-[16px] md:flex md:w-full md:flex-row md:justify-center md:pb-2">
            {answersDataRes.map((item, index: number) => {
              const isAnswerSelected = item.id === nextID;

              return (
                <button
                  type="button"
                  key={item.id}
                  id={item.id}
                  onClick={() => onSelectAnswer(item.id)} //handleQuestionAndAnswers
                  className={classNames(
                    isAnswerSelected
                      ? 'ring-[6px] ring-inset ring-primary'
                      : 'border border-gray lg:hover:ring-2 lg:hover:ring-black',
                    'flex h-full cursor-pointer flex-col justify-start self-stretch rounded-[10px] border-solid bg-light-gray px-s py-m text-center max-ml:mb-s max-md:flex-col md:w-[288px] md:py-ml',
                    index < answersDataRes.length - 1 ? 'md:mr-s' : ''
                  )}
                >
                  <ImagePrimary
                    fields={{
                      primaryImageCaption: { value: '' },
                      primaryImage: { value: item.primaryImage },
                      primaryImageMobile: { value: item.primaryImageMobile },
                      primaryImageMobileFocusArea: item.primaryImageMobileFocusArea?.targetItem
                        ?.value.value
                        ? {
                            id: '',
                            url: '',
                            name: item.primaryImageMobileFocusArea.targetItem.value.value,
                            displayName: item.primaryImageMobileFocusArea.targetItem.value.value,
                            fields: {
                              Value: {
                                value: item.primaryImageMobileFocusArea.targetItem.value.value,
                              },
                            },
                          }
                        : {
                            id: '',
                            url: '',
                            name: 'Center',
                            displayName: 'Center',
                            fields: {
                              Value: {
                                value: 'center',
                              },
                            },
                          },
                    }}
                    additionalMobileClasses="max-w-[120px] max-h-[120px] h-[120px] [&_span]:max-h-[120px] mx-auto" //max-w-[64px] max-h-[64px] h-[64px]
                    additionalDesktopClasses="max-w-[180px] max-h-[180px] h-[180px] [&_span]:max-h-[180px] mx-auto" //image part
                    imageLayout="intrinsic"
                  />

                  <div className="max-md:text-center md:mt-s">
                    <div className="mb-xxs w-full text-center font-sans text-sm-xs font-heavy md:text-xs">
                      <Text field={{ value: item.answerText.value }} />
                    </div>

                    <RichTextWrapper
                      field={{ value: item.answerDescription.value }}
                      classes="md:text-center text-dark-gray"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ✅ CTA section unchanged */}
      <div
        className={classNames(
          allQuestionID.length > 1
            ? 'justify-between md:justify-center'
            : 'justify-end md:justify-center',
          answersError ? 'justify-center' : '',
          'flex w-full md:mt-l gap-3 md:gap-s'
        )}
      >
        {allQuestionID.length > 1 && (
          // Previous button
          <button
            type="button"
            onClick={onPrevious}
            className="flex w-fit cursor-pointer items-center whitespace-nowrap rounded-lg border-4 border-gray px-m py-2.25 font-sans text-button font-bold hover:bg-gray hover:text-white"
          >
            <SvgIcon icon="arrow" className="mr-xxs rotate-180" />
            {fields?.previousCtaText?.value}
            {/* </div> */}
          </button>
        )}

        {answersError ? (
          // Disabled Next button
          <div>
            <div className="pointer-events-none flex w-fit cursor-not-allowed items-center whitespace-nowrap rounded-lg border-4 border-gray px-m py-2.25 font-heavy text-gray">
              {fields?.nextCtaText?.value}
              <SvgIcon icon="arrow" className="ml-xxs" />
            </div>
          </div>
        ) : (
          // Next button
          <button
            type="button"
            onClick={onNext}
            className="flex w-fit cursor-pointer items-center whitespace-nowrap rounded-lg border-4 border-theme-btn-border bg-theme-btn-bg px-m py-2.25 font-sans text-button font-heavy text-theme-btn-text md:hover:border-theme-btn-border-hover lg:hover:bg-theme-btn-bg-hover lg:hover:text-theme-btn-text-hover"
          >
            {fields?.nextCtaText?.value}
            <SvgIcon icon="arrow" className="ml-xxs" />
            {/* </div> */}
          </button>
        )}
      </div>

      {showErrorText && (
        <div className="mt-xxs text-small text-error-outline text-center">
          <Text field={{ value: errorText }} />
        </div>
      )}
    </>
  );
});
