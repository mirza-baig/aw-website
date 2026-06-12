'use client';

/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Field, useSitecore } from '@sitecore-content-sdk/nextjs';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import { JSX, useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

import { AnswersUI } from './AnswersUI';
import { BreadcrumbUI } from './BreadcrumbUI';
import { RecommendationUI } from './RecommendationUI';
import { Answer, Question } from './StormDoorChooseTool.helper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type StormDoorChooseToolProps =
  Sitecore.Components.Tool.StormDoorChooseTool.StormDoorChooseTool;
export function StormDoorChooseToolClient(props: StormDoorChooseToolProps): JSX.Element {
  const { fields } = props;
  const { page } = useSitecore();
  const language = page.locale ?? 'en';

  const questionIDStep1 = fields?.children[0]?.id;
  const startOverCtaText = fields?.startOverCtaText?.value;
  const summaryHeadline = fields?.summaryHeadline?.value;
  const youSelectedHeadline = fields?.youSelectedHeadline?.value;
  const questionTextStep1 = fields?.children[0].fields.questionText?.value;

  const [allQuestionID, setAllQuestionID] = useState<Question[]>([]);
  const [questionID, setQuestionID] = useState<string>(questionIDStep1);
  const [currentAnswerId, setCurrentAnswerId] = useState<string | undefined>();
  const [questionDataQuestionText, setquestionDataQuestionText] =
    useState<string>(questionTextStep1);
  const [answersDataRes, setAnswersDataRes] = useState<Answer[]>([]);
  const [showRecommendation, setShowRecommendation] = useState<boolean>(false);
  const [recommendationDataRes, setRecommendationDataRes] = useState<Answer[]>([]);
  const [errorText, setErrorText] = useState<string>(fields?.children[0].fields.errorText.value);
  const [showErrorText, setShowErrorText] = useState<boolean>(false);
  const [nextID, setNextID] = useState<string | undefined>();
  const [allSelectedAnswerId, setAllSelectedAnswerId] = useState<string[]>([]);
  const [allSelectedAnswerText, setAllSelectedAnswerText] = useState<
    { answerText: Field<string> }[]
  >([]);

  const [recommendationProductIds, setRecommendationProductIds] = useState<string[]>([]);
  const [recommendationProductsRes, setRecommendationProductsRes] = useState<string[]>([]);
  const [resetCounter, setResetCounter] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetcher = async (url: string, body: { [key: string]: unknown }) => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const responseData = await response.json();
    return responseData;
  };

  const swrKey = questionID
    ? ['/api/aw/storm-door-choose-tool/get-question-and-answers', questionID, language]
    : null;

  const { data: answersData } = useSWR(swrKey, ([url, qid, lang]) =>
    fetcher(url, { questionID: qid, language: lang })
  );
  const onSelectAnswer = useCallback((id: string) => {
    setNextID(id);
    setShowErrorText(false);
  }, []);

  const onNext = useCallback(() => {
    if (!nextID) {
      setShowErrorText(true);
      return;
    }

    const selectedAnswer = answersDataRes.find((a) => a.id === nextID);
    setCurrentAnswerId(nextID);
    if (selectedAnswer) {
      setAllSelectedAnswerId((prev) => {
        const updated = prev.slice(0, allQuestionID.length - 1);
        return [...updated, nextID];
      });

      setAllSelectedAnswerText((prev) => {
        const updated = prev.slice(0, allQuestionID.length - 1);
        return [...updated, selectedAnswer];
      });
    }
  }, [nextID, answersDataRes]);

  const onPrevious = useCallback(() => {
    handlePrevious();
  }, []);

  const onStartOver = useCallback(() => {
    handleStartOver();
  }, []);

  const handleBreadcrumbClick = useCallback(
    (id: string) => {
      setCurrentAnswerId('');
      setShowRecommendation(false);

      const index = allQuestionID.findIndex((q) => q.id === id);
      if (index !== -1) {
        setAllQuestionID((prev) => prev.slice(0, index + 1));
      }

      setQuestionID(id);
    },
    [allQuestionID]
  );

  useEffect(() => {
    if (fields?.children[0]?.id) {
      setQuestionID(fields?.children[0]?.id);
    }
    // need only to set 1st QuestionID
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: recommendationData, mutate: mutateRecommendationData } = useSWR(
    '/api/aw/storm-door-choose-tool/get-next-question-or-recommendation',
    (url) => fetcher(url, { currentAnswerId, language })
  );
  useEffect(() => {
    mutateRecommendationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAnswerId, resetCounter]);

  useEffect(() => {
    if (answersData?.results) {
      setIsLoading(false);
      const data = answersData.results;
      const updatedQuestionIDs = allQuestionID.filter(Boolean);
      if (!updatedQuestionIDs.some((q) => q?.id === data.question.id)) {
        const resQues = data.question as Question;
        updatedQuestionIDs.push(resQues);
      }
      setAllQuestionID(updatedQuestionIDs);
      const questionDataResultquestionText = data.question.questionText?.value;
      const answersDataResults = data.answers.children.results as Answer[];
      setAnswersDataRes(answersDataResults);
      setquestionDataQuestionText(questionDataResultquestionText);
      const errorTextVal = data.question.errorText?.value;
      setErrorText(errorTextVal);
      setShowErrorText(false);
      const isAnyAnswerSelected = data.answers.children.results.some(
        (answer: Answer) => answer?.id && allSelectedAnswerId.includes(answer.id)
      );

      if (isAnyAnswerSelected) {
        const matchingAnswer = data.answers.children.results.find(
          (answer: Answer) => answer?.id && allSelectedAnswerId.includes(answer.id)
        );

        if (matchingAnswer) {
          setNextID(matchingAnswer.id);
        } else {
          setNextID('');
        }
      } else {
        setNextID('');
      }
    }
    // based on answersData
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answersData]);

  useEffect(() => {
    if (recommendationData?.results?.question) {
      const data = recommendationData.results.question.children;
      const isRecommendation = data.results[0]?.template?.name === 'AW_Recommendation';
      const nextID = data.results[0]?.id;
      nextID && setQuestionID(nextID);
      if (isRecommendation) {
        setResetCounter(0);
        // we can ignore the typeerror for the useSWR data response of stormdoorChooseTool data
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const newProductIds: any = Array.from(
          new Set(
            data.results.map((recommendation: any) => recommendation.productItem.value.trim())
          )
        ).filter((productId) => productId !== '' && productId !== '""');
        /* eslint-enable @typescript-eslint/no-explicit-any */
        setRecommendationProductIds(newProductIds);
        setShowRecommendation(true);
        setRecommendationDataRes(data.results);
      } else {
        setShowRecommendation(false);
      }
    }
  }, [recommendationData]);

  const { data: recommendationProducts, error: recommendationProductsError } = useSWR(
    recommendationProductIds.length ? '/api/aw/storm-door-choose-tool/get-product' : null,
    (url) => fetcher(url, { recommendationProductIds, language })
  );
  useEffect(() => {
    if (recommendationProducts) {
      const data = recommendationProducts.results;
      setRecommendationProductsRes(data);
    }
  }, [recommendationProducts]);

  const handlePrevious = () => {
    setCurrentAnswerId('');
    setShowRecommendation(false);
    setRecommendationDataRes([]);
    setRecommendationProductIds([]);
    setRecommendationProductsRes([]);
    const updatedQuestionIDs = [...allQuestionID];
    updatedQuestionIDs.pop();
    setAllQuestionID(updatedQuestionIDs);

    const qid = updatedQuestionIDs.at(-1)?.id ?? questionIDStep1;
    if (qid) {
      setQuestionID(qid);
    }
    setNextID('');
  };

  const handleStartOver = () => {
    setIsLoading(true);
    setAnswersDataRes([]);
    setQuestionID(questionIDStep1);
    setShowRecommendation(false);
    setRecommendationDataRes([]);
    setRecommendationProductIds([]);
    setRecommendationProductsRes([]);
    setNextID('');
    setAllSelectedAnswerId([]);
    setAllSelectedAnswerText([]);

    const first = allQuestionID?.[0];
    setAllQuestionID(first ? [first] : []);
  };

  return (
    <Component variant="lg" dataomponent="tool/stormdoorchoosetool" padding={'px-[8px]'} {...props}>
      <div className="col-span-12 lg:col-span-2"></div>
      <div className="col-span-12 max-ml:text-center lg:col-span-8">
        <div className="flex justify-center">
          <Headline
            useTag="h4"
            classes="mb-xxxs font-sans font-heavy text-s ml:text-m"
            {...props}
            fields={fields}
          />
        </div>
        <BreadcrumbUI
          allQuestionID={allQuestionID}
          showRecommendation={showRecommendation}
          onClickBreadcrumb={handleBreadcrumbClick}
        />
        {showRecommendation ? (
          <RecommendationUI
            recommendationDataRes={recommendationDataRes}
            recommendationProductsRes={recommendationProductsRes}
            recommendationProductsError={recommendationProductsError}
            allSelectedAnswerText={allSelectedAnswerText}
            summaryHeadline={summaryHeadline}
            youSelectedHeadline={youSelectedHeadline}
            startOverText={startOverCtaText}
            onStartOver={onStartOver}
            isLoading={!recommendationProductsRes.length}
          />
        ) : (
          <AnswersUI
            fields={fields}
            answersDataRes={answersDataRes}
            questionDataQuestionText={questionDataQuestionText}
            errorText={errorText}
            showErrorText={showErrorText}
            nextID={nextID}
            allQuestionID={allQuestionID}
            onSelectAnswer={onSelectAnswer}
            onNext={onNext}
            onPrevious={onPrevious}
            isLoading={isLoading}
          />
        )}
      </div>
    </Component>
  );
}
