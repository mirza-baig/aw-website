import { describe, expect, test, vi } from 'vitest';

import {
  consumeStream,
  handleStreamEvent,
  parseNdjsonLine,
  resolveStageText,
} from '../TechDocChatbot';

describe('components > tool > TechDocChatBot > utilities', () => {
  describe('resolveStageText', () => {
    test('returns message when provided', () => {
      expect(resolveStageText('searching', 'Custom message')).toBe('Custom message');
    });

    test('returns searching text for searching stage', () => {
      expect(resolveStageText('searching')).toBe('Searching documents...');
    });

    test('returns analyzing text for analyzing stage', () => {
      expect(resolveStageText('analyzing')).toBe('Analyzing sources...');
    });

    test('formats unknown stage with underscores replaced', () => {
      expect(resolveStageText('loading_data')).toBe('loading data...');
    });

    test('returns Working... for empty stage', () => {
      expect(resolveStageText('')).toBe('Working...');
    });

    test('message takes priority over stage text', () => {
      expect(resolveStageText('analyzing', 'Override')).toBe('Override');
    });
  });

  describe('parseNdjsonLine', () => {
    test('parses valid JSON line', () => {
      expect(parseNdjsonLine('{"type":"status"}')).toEqual({ type: 'status' });
    });

    test('parses line with data: prefix', () => {
      expect(parseNdjsonLine('data: {"type":"answer"}')).toEqual({ type: 'answer' });
    });

    test('returns null for empty string', () => {
      expect(parseNdjsonLine('')).toBeNull();
    });

    test('returns null for whitespace-only string', () => {
      expect(parseNdjsonLine('   ')).toBeNull();
    });

    test('returns null for invalid JSON', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      expect(parseNdjsonLine('not json')).toBeNull();
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    test('handles data: prefix with extra whitespace', () => {
      expect(parseNdjsonLine('data:   {"key":"val"}')).toEqual({ key: 'val' });
    });

    test('trims leading/trailing whitespace', () => {
      expect(parseNdjsonLine('  {"a":1}  ')).toEqual({ a: 1 });
    });
  });

  describe('handleStreamEvent', () => {
    function createMockHandlers() {
      return {
        updateStatusStage: vi.fn(),
        updateStatus: vi.fn(),
        stopStatusRotation: vi.fn(),
        patchMessageById: vi.fn(),
        thinkingId: 'thinking-1',
        setFinalSources: vi.fn(),
        appendAnswer: vi.fn((delta: string) => delta),
        setFinalAnswer: vi.fn(),
        setFinalIds: vi.fn(),
      };
    }

    test('handles status event with searching stage', () => {
      const h = createMockHandlers();
      handleStreamEvent({ type: 'status', stage: 'searching' }, h);
      expect(h.updateStatusStage).toHaveBeenCalledWith('searching', 'Searching documents...');
    });

    test('handles status event with analyzing stage', () => {
      const h = createMockHandlers();
      handleStreamEvent({ type: 'status', stage: 'analyzing' }, h);
      expect(h.updateStatusStage).toHaveBeenCalledWith('analyzing', 'Analyzing sources...');
    });

    test('handles status event with custom message', () => {
      const h = createMockHandlers();
      handleStreamEvent({ type: 'status', stage: 'searching', message: 'Custom' }, h);
      expect(h.updateStatusStage).toHaveBeenCalledWith('searching', 'Custom');
    });

    test('handles status event with unknown stage via updateStatus', () => {
      const h = createMockHandlers();
      handleStreamEvent({ type: 'status', stage: 'other' }, h);
      expect(h.updateStatus).toHaveBeenCalledWith('other...');
      expect(h.updateStatusStage).not.toHaveBeenCalled();
    });

    test('handles status event with empty stage', () => {
      const h = createMockHandlers();
      handleStreamEvent({ type: 'status', stage: '' }, h);
      expect(h.updateStatus).toHaveBeenCalledWith('Working...');
    });

    test('handles status event with null stage', () => {
      const h = createMockHandlers();
      handleStreamEvent({ type: 'status', stage: null }, h);
      expect(h.updateStatus).toHaveBeenCalled();
    });

    test('handles sources event with sources', () => {
      const h = createMockHandlers();
      const sources = [{ file_name: 'doc.pdf', page_numbers: [1] }];
      handleStreamEvent({ type: 'sources', sources }, h);
      expect(h.setFinalSources).toHaveBeenCalledWith(sources);
      expect(h.patchMessageById).toHaveBeenCalledWith('thinking-1', { sources });
      expect(h.updateStatusStage).toHaveBeenCalledWith(
        'analyzing',
        'Found 1 sources. Generating answer...'
      );
    });

    test('handles sources event with empty sources', () => {
      const h = createMockHandlers();
      handleStreamEvent({ type: 'sources', sources: [] }, h);
      expect(h.setFinalSources).toHaveBeenCalledWith([]);
      expect(h.updateStatusStage).not.toHaveBeenCalled();
    });

    test('handles sources event with non-array sources', () => {
      const h = createMockHandlers();
      handleStreamEvent({ type: 'sources', sources: 'invalid' }, h);
      expect(h.setFinalSources).toHaveBeenCalledWith([]);
    });

    test('handles answer event', () => {
      const h = createMockHandlers();
      h.appendAnswer.mockReturnValue('Hello world');
      handleStreamEvent({ type: 'answer', delta: 'Hello world' }, h);
      expect(h.stopStatusRotation).toHaveBeenCalled();
      expect(h.appendAnswer).toHaveBeenCalledWith('Hello world');
      expect(h.patchMessageById).toHaveBeenCalledWith('thinking-1', {
        text: 'Hello world',
        isThinking: false,
      });
    });

    test('handles answer_final event with html', () => {
      const h = createMockHandlers();
      handleStreamEvent({ type: 'answer_final', answer_html: '<p>Result</p>' }, h);
      expect(h.stopStatusRotation).toHaveBeenCalled();
      expect(h.setFinalAnswer).toHaveBeenCalledWith('<p>Result</p>');
      expect(h.patchMessageById).toHaveBeenCalledWith('thinking-1', {
        text: '<p>Result</p>',
        isThinking: false,
      });
    });

    test('handles answer_final event with empty html', () => {
      const h = createMockHandlers();
      handleStreamEvent({ type: 'answer_final', answer_html: '' }, h);
      expect(h.stopStatusRotation).toHaveBeenCalled();
      expect(h.setFinalAnswer).not.toHaveBeenCalled();
      expect(h.patchMessageById).not.toHaveBeenCalled();
    });

    test('handles answer_final event with null html', () => {
      const h = createMockHandlers();
      handleStreamEvent({ type: 'answer_final', answer_html: null }, h);
      expect(h.stopStatusRotation).toHaveBeenCalled();
      expect(h.setFinalAnswer).not.toHaveBeenCalled();
    });

    test('handles done event', () => {
      const h = createMockHandlers();
      handleStreamEvent({ type: 'done', message_id: 10, session_id: 20 }, h);
      expect(h.setFinalIds).toHaveBeenCalledWith(10, 20);
    });

    test('handles answer event with null delta', () => {
      const h = createMockHandlers();
      h.appendAnswer.mockReturnValue('');
      handleStreamEvent({ type: 'answer', delta: null }, h);
      expect(h.appendAnswer).toHaveBeenCalledWith('');
    });

    test('ignores unknown event types', () => {
      const h = createMockHandlers();
      handleStreamEvent({ type: 'unknown_type' }, h);
      expect(h.updateStatusStage).not.toHaveBeenCalled();
      expect(h.updateStatus).not.toHaveBeenCalled();
      expect(h.stopStatusRotation).not.toHaveBeenCalled();
      expect(h.setFinalIds).not.toHaveBeenCalled();
    });
  });

  describe('consumeStream', () => {
    function createMockReader(lines: string[]) {
      const encoder = new TextEncoder();
      const chunks = lines.map((l) => encoder.encode(l));
      let idx = 0;
      return {
        read: vi.fn(async () => {
          if (idx < chunks.length) {
            return { done: false, value: chunks[idx++] };
          }
          return { done: true, value: undefined };
        }),
      };
    }

    function createStubHandlers() {
      return {
        updateStatusStage: vi.fn(),
        updateStatus: vi.fn(),
        stopStatusRotation: vi.fn(),
        patchMessageById: vi.fn(),
        thinkingId: 'thinking-1',
        setFinalSources: vi.fn(),
        appendAnswer: vi.fn(),
        setFinalAnswer: vi.fn(),
        setFinalIds: vi.fn(),
      };
    }

    test('consumes a complete stream with status, sources, answer, and done', async () => {
      const reader = createMockReader([
        '{"type":"status","stage":"searching"}\n',
        '{"type":"sources","sources":[{"file_name":"doc.pdf"}]}\n',
        '{"type":"answer","delta":"Hello "}\n',
        '{"type":"answer","delta":"world"}\n',
        '{"type":"answer_final","answer_html":"<b>Hello world</b>"}\n',
        '{"type":"done","message_id":42,"session_id":99}\n',
      ]);

      const handlers = createStubHandlers();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await consumeStream(reader as any, handlers);

      expect(result.messageId).toBe(42);
      expect(result.sessionId).toBe(99);
      expect(result.answerHtml).toBe('<b>Hello world</b>');
      expect(result.answerBuffer).toBe('Hello world');
      expect(result.sources).toEqual([{ file_name: 'doc.pdf' }]);
    });

    test('returns empty defaults when stream has no answer', async () => {
      const reader = createMockReader(['{"type":"status","stage":"searching"}\n']);
      const handlers = createStubHandlers();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await consumeStream(reader as any, handlers);

      expect(result.answerHtml).toBeNull();
      expect(result.answerBuffer).toBe('');
      expect(result.sources).toEqual([]);
      expect(result.messageId).toBeUndefined();
      expect(result.sessionId).toBeUndefined();
    });

    test('handles data: prefixed lines', async () => {
      const reader = createMockReader(['data: {"type":"done","message_id":1,"session_id":2}\n']);
      const handlers = createStubHandlers();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await consumeStream(reader as any, handlers);

      expect(result.messageId).toBe(1);
      expect(result.sessionId).toBe(2);
    });

    test('skips invalid JSON lines gracefully', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      const reader = createMockReader(['not json\n', '{"type":"done","message_id":5}\n']);
      const handlers = createStubHandlers();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await consumeStream(reader as any, handlers);

      expect(result.messageId).toBe(5);
      vi.restoreAllMocks();
    });

    test('accumulates answer deltas', async () => {
      const reader = createMockReader([
        '{"type":"answer","delta":"a"}\n',
        '{"type":"answer","delta":"b"}\n',
        '{"type":"answer","delta":"c"}\n',
      ]);
      const handlers = createStubHandlers();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await consumeStream(reader as any, handlers);

      expect(result.answerBuffer).toBe('abc');
    });

    test('calls stopStatusRotation on answer events', async () => {
      const reader = createMockReader(['{"type":"answer","delta":"x"}\n']);
      const handlers = createStubHandlers();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await consumeStream(reader as any, handlers);

      expect(handlers.stopStatusRotation).toHaveBeenCalled();
    });

    test('calls patchMessageById for answer events', async () => {
      const reader = createMockReader(['{"type":"answer","delta":"Hi"}\n']);
      const handlers = createStubHandlers();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await consumeStream(reader as any, handlers);

      expect(handlers.patchMessageById).toHaveBeenCalledWith('thinking-1', {
        text: 'Hi',
        isThinking: false,
      });
    });

    test('handles chunked data across multiple reads', async () => {
      const encoder = new TextEncoder();
      // Split a JSON line across two chunks
      const chunk1 = encoder.encode('{"type":"don');
      const chunk2 = encoder.encode('e","message_id":7}\n');
      let idx = 0;
      const chunks = [chunk1, chunk2];
      const reader = {
        read: vi.fn(async () => {
          if (idx < chunks.length) {
            return { done: false, value: chunks[idx++] };
          }
          return { done: true, value: undefined };
        }),
      };
      const handlers = createStubHandlers();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await consumeStream(reader as any, handlers);

      expect(result.messageId).toBe(7);
    });
  });
});
