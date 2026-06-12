import { JSX, useMemo } from 'react';

import { DEALER_MODE, EXCLUDE_BY_USER_TYPE, HOMEOWNER_MODE } from './constants';
import type { Question } from './types/activeStepData';

type UserMode = typeof DEALER_MODE | typeof HOMEOWNER_MODE;

type Props = {
  Questions: Question[];
  onChange?: (questionId: string, value: string, classification: string) => void;
  // Optional: base path for images if your URLs are relative to public folder
  imageBaseUrl?: string;
  mode: UserMode;
};

function normalizeImageUrl(url?: string | null, base?: string): string | undefined {
  if (!url) {
    return undefined;
  }
  // Data uses backslashes. Convert to forward slashes for web.
  const cleaned = url.replaceAll('\\', '/');
  // If a base is provided and url is relative, prefix it.
  if (base && !/^https?:\/\//i.test(cleaned)) {
    // Ensure single slash between
    return `${base.replace(/\/+$/, '')}/${cleaned.replace(/^\/+/, '')}`;
  }
  return cleaned;
}

function isDropdownForMultiChoice(question: Question): boolean {
  const text = question.QuestionText.trim().toLowerCase();
  return text === 'standard width' || text === 'standard height';
}

function getAnswerStyle(question: Question): string | undefined {
  const kv = question.ExtraFields?.find((e) => e.Key === 'WebCPAnswerStyle');
  return kv?.Value;
}

function renderQuestionInput(
  q: Question,
  onChange?: (questionId: string, value: string, classification: string) => void,
  imageBaseUrl?: string
): JSX.Element | null {
  if (q.QuestionType === 'FreeEntry') {
    return <FreeEntryInput question={q} onChange={onChange} />;
  }

  if (q.QuestionType === 'MultiChoice' && isDropdownForMultiChoice(q)) {
    return <MultiChoiceDropdown question={q} onChange={onChange} />;
  }

  if (q.QuestionType === 'MultiChoice') {
    return (
      <MultiChoiceRadioGroup
        question={q}
        onChange={onChange}
        imageBaseUrl={imageBaseUrl}
        answerStyle={getAnswerStyle(q)}
      />
    );
  }

  return null;
}

export default function QuestionsComponent({
  Questions,
  onChange,
  imageBaseUrl,
  mode,
}: Readonly<Props>): JSX.Element {
  const excludeSet = useMemo(() => {
    const ids = EXCLUDE_BY_USER_TYPE[mode] ?? [];
    return new Set(ids);
  }, [mode]);

  const filteredQuestions = useMemo(
    () => Questions?.filter((q) => q.ID?.trim() && !excludeSet.has(q.ID.trim())) ?? [],
    [Questions, excludeSet]
  );

  return (
    <div className="bg-light-gray">
      {filteredQuestions.map((q) => (
        <div key={q.ID} className="p-4 pb-0 last:pb-4">
          <div className="w-full">
            <label className="text-sm font-semibold">{q.QuestionText}</label>
            {q.StopType === 2 && <span className="ml-3 text-xxs text-red-500"> * required</span>}
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="mt-2">{renderQuestionInput(q, onChange, imageBaseUrl)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const FreeEntryInput: React.FC<{
  question: Question;
  onChange?: (questionId: string, value: string, classification: string) => void;
}> = ({ question, onChange }) => {
  const disabled = !!question.Locked;

  // Using onBlur to reduce frequent updates while typing,
  // in the future we might want to debounce onChange instead
  return (
    <input
      id={question.ID}
      type={question.IsNumeric ? 'number' : 'text'}
      value={disabled ? (question.SelectedAnswerID ?? '') : undefined}
      defaultValue={disabled ? undefined : (question.SelectedAnswerID ?? '')}
      disabled={disabled}
      data-classification={question.QuestionClassification ?? undefined}
      onBlur={(e) => onChange?.(question.ID, e.target.value, question.QuestionClassification ?? '')}
      className={`w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm
        ${
          disabled
            ? 'border-gray-200 text-gray-500 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300'
        }
        focus:border-2 focus:border-black focus:ring-0`}
    />
  );
};

const MultiChoiceDropdown: React.FC<{
  question: Question;
  onChange?: (questionId: string, value: string, classification: string) => void;
}> = ({ question, onChange }) => {
  const disabled = !!question.Locked;

  return (
    <div className="relative">
      <select
        name={question.QuestionText}
        value={question.SelectedAnswerID ?? ''}
        data-classification={question.QuestionClassification ?? undefined}
        disabled={disabled}
        onChange={(e) =>
          onChange?.(question.ID, e.target.value, question.QuestionClassification ?? '')
        }
        className={`rounded-md border text-sm
          ${
            disabled
              ? 'border-gray-200 text-gray-500 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300'
          }
          focus:border-2 focus:border-black focus:ring-0`}
      >
        {question.Answers.map((a) => (
          <option key={a.ID} value={a.ID}>
            {a.Text}
          </option>
        ))}
      </select>
    </div>
  );
};

const MultiChoiceRadioGroup: React.FC<{
  question: Question;
  onChange?: (questionId: string, value: string, classification: string) => void;
  imageBaseUrl?: string;
  answerStyle?: string;
}> = ({ question, onChange, imageBaseUrl, answerStyle }) => {
  const disabled = !!question.Locked;
  const name = `q-${question.ID}`;

  // Style mapping based on WebCPAnswerStyle
  const isSmallIcons = answerStyle?.toLowerCase().includes('smallicons') ?? false;
  const isTextOnly = answerStyle?.toLowerCase().includes('textonly') ?? false;
  const isVertical = answerStyle?.toLowerCase().includes('vertical') ?? false;

  const containerClass = isVertical ? 'space-y-3' : 'flex flex-wrap gap-3';

  return (
    <div className={containerClass}>
      {question.Answers.map((a) => {
        const img = normalizeImageUrl(a.ImageURL, imageBaseUrl);
        const checked = a.ID === question.SelectedAnswerID;

        return (
          <label
            key={a.ID}
            className={`group relative flex w-32 cursor-pointer flex-col items-center gap-3 rounded-md border bg-white p-2 text-sm
              ${checked ? 'border-[#F26924] ring-1 ring-[#F26924]' : 'border-gray-300'}
              ${
                disabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:border-[#000000] hover:ring-1 hover:ring-[#000000]'
              }
            `}
            title={a.HoverText ?? undefined}
          >
            <input
              type="radio"
              name={name}
              value={a.ID}
              data-classification={question.QuestionClassification ?? undefined}
              checked={checked}
              disabled={disabled}
              onChange={(e) =>
                onChange?.(question.ID, e.target.value, question.QuestionClassification ?? '')
              }
              className="sr-only"
            />

            {/* Image (hidden for text-only styles) */}
            {!isTextOnly && img ? (
              <img
                src={img}
                alt={a.Text}
                className={`${isSmallIcons ? 'h-15 w-15' : 'h-16 w-16'} shrink-0 object-cover`}
              />
            ) : null}

            {/* Text */}
            <div className="flex flex-col">
              <span className="text-gray-900 text-center font-medium">{a.Text}</span>
              {a.MarketingText ? (
                <span className="text-gray-500 text-center text-xs">{a.MarketingText}</span>
              ) : null}
              {a.InfoLinkURL ? (
                <a
                  href={a.InfoLinkURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 text-xs text-blue-600 hover:text-blue-700"
                >
                  More info
                </a>
              ) : null}
            </div>
          </label>
        );
      })}
    </div>
  );
};
