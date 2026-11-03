import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchProductQuestions } from './fetch-product-questions';

vi.mock('aw.config.server', () => ({
  default: {
    bazaarvoice: {
      apiUrl: 'https://stg.api.bazaarvoice.com/data/reviews.json?apiversion=5.4&passkey=',
      apiKey: 'test-passkey',
    },
  },
}));

describe('fetchProductQuestions', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('requests the latest questions with answers for the Bazaarvoice product', async () => {
    const questions = [
      {
        Id: 'q1',
        QuestionSummary: 'Is this energy efficient?',
        AnswerIds: ['a1'],
      },
    ];
    const answers = {
      a1: {
        Id: 'a1',
        QuestionId: 'q1',
        AnswerText: 'Yes, ENERGY STAR certified.',
      },
    };
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ Results: questions, Includes: { Answers: answers } }),
    } as Response);

    await expect(fetchProductQuestions(' 100-AWN ')).resolves.toEqual([
      {
        Id: 'q1',
        QuestionSummary: 'Is this energy efficient?',
        AnswerIds: ['a1'],
        Answers: [answers.a1],
      },
    ]);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://stg.api.bazaarvoice.com/data/questions.json?apiversion=5.4&passkey=test-passkey&Filter=ProductId:100-AWN&Include=Answers&Sort=SubmissionTime:desc&Limit=100'
    );
  });

  it('does not request questions for an empty product id', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');

    await expect(fetchProductQuestions('   ')).resolves.toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns questions with empty answer lists when Includes is missing', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ Results: [{ Id: 'q1', AnswerIds: ['a1'] }] }),
    } as Response);

    await expect(fetchProductQuestions('100-AWN')).resolves.toEqual([
      { Id: 'q1', AnswerIds: ['a1'], Answers: [] },
    ]);
  });

  it('reports Bazaarvoice API errors returned in a successful response', async () => {
    const error = { Code: 'ERROR_PARAM_INVALID_FILTER_ATTRIBUTE', Message: 'Invalid filter' };
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ Errors: [error] }),
    } as Response);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(fetchProductQuestions('100-AWN')).resolves.toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('[fetch-product-questions] API response errors:', [
      error,
    ]);
  });
});
