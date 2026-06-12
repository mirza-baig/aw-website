'use client';

import classNames from 'classnames';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX, useEffect, useRef, useState } from 'react';

import styles from './helpers/TechDocChatBot.module.css';
import { Sitecore } from '.sitecore/AndersenWindows.model';

// Add console logging for debugging
if (typeof window !== 'undefined') {
  console.log('[TechDocChatBot] Component loaded and ready');
}

type TechDocChatbotProps = ComponentProps & Sitecore.Components.Tool.TechDocChatbot.TechDocChatbot;

const formatPages = (pages: SourceRef['page_numbers']) => {
  if (Array.isArray(pages)) {
    return pages.join(', ');
  }
  if (typeof pages === 'string') {
    return pages;
  }
  return '';
};

/**
 * Convert markdown-style text to HTML with styled document links
 * - Converts **text** to <strong>text</strong>
 * - Enhances backend-generated download links with Figma-designed styling (download icon)
 */
const formatResponseText = (text: string): string => {
  // First, convert markdown bold **text** to <strong>text</strong>
  let html = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Download icon SVG per Figma design
  const downloadIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" fill="none" style="display:inline-block;vertical-align:middle;margin-left:6px;"><path d="M5.53125 10L5.53125 1" stroke="#ED6833" stroke-width="1.5"/><path d="M10.4297 4.94922L5.47994 9.89897L0.530193 4.94922" stroke="#ED6833" stroke-width="1.5"/><path d="M0.03125 13H11.0312" stroke="#ED6833" stroke-width="2"/></svg>`;

  // Enhance backend-generated <a> tags that link to /downloadfile with the download icon
  // Backend generates: <a href="...downloadfile?filename=doc.pdf" ...>doc.pdf</a>
  // We add the download icon and document-link class for styling
  html = html.replace(
    /<a\s+href="([^"]*\/downloadfile\?filename=[^"]+)"([^>]*)>([^<]+)<\/a>/gi,
    (_match, url, attrs, linkText) => {
      return `<a href="${url}" class="document-link"${attrs}>${linkText}${downloadIcon}</a>`;
    }
  );

  return html;
};

interface SourceRef {
  file_name?: string | null;
  page_numbers?: number[] | string | null;
  raw_text?: string | null;
  url?: string | null;
}

const STATUS_ROTATION_MS = 2000;
const STATUS_ROTATION_COPY: Record<'searching' | 'analyzing', string[]> = {
  searching: [
    'Searching documents...',
    'Matching product lines and document types...',
    'Comparing matching documents...',
    'Checking source relevance...',
    'Scanning related technical sections...',
    'Cross-checking product references...',
    'Narrowing to the best source excerpts...',
    'Preparing source cards...',
    'Grouping supporting evidence...',
    'Organizing the strongest matches...',
  ],
  analyzing: [
    'Analyzing sources...',
    'Reading the most relevant excerpts...',
    'Comparing details across documents...',
    'Weighing evidence across sources...',
    'Reconciling overlapping evidence...',
    'Verifying the answer against source text...',
    'Drafting answer...',
    'Tightening wording...',
    'Adding citations...',
    'Finalizing response...',
    'Preparing the final answer...',
  ],
};
const STATUS_FALLBACK_COPY: Record<'searching' | 'analyzing', string[]> = {
  searching: [
    'Reviewing additional document matches...',
    'Checking neighboring source sections...',
    'Refining the document shortlist...',
  ],
  analyzing: [
    'Double-checking supporting details...',
    'Confirming the best citations...',
    'Polishing the final response...',
  ],
};
const STATUS_FALLBACK_TEMPLATES: Record<'searching' | 'analyzing', string> = {
  searching: 'Still searching documents... ({elapsedSeconds}s)',
  analyzing: 'Still preparing the response... ({elapsedSeconds}s)',
};
type StatusStage = keyof typeof STATUS_ROTATION_COPY;

const getStatusRotationText = (stage: StatusStage, step: number, elapsedMs: number): string => {
  const scriptedMessages = STATUS_ROTATION_COPY[stage];
  if (step < scriptedMessages.length) {
    return scriptedMessages[step];
  }

  const fallbackMessages = STATUS_FALLBACK_COPY[stage];
  const fallbackStep = step - scriptedMessages.length;
  if (fallbackStep < fallbackMessages.length) {
    return fallbackMessages[fallbackStep];
  }

  const elapsedSeconds = Math.max(2, Math.floor(elapsedMs / 1000));
  return STATUS_FALLBACK_TEMPLATES[stage].replace('{elapsedSeconds}', String(elapsedSeconds));
};

interface BetaFeedbackData {
  rating: number;
  userName?: string | null;
  responses: { question_id: number; answer_text: string }[];
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sources?: SourceRef[];
  backendMessageId?: number;
  backendSessionId?: number;
  feedback?: 'up' | 'down';
  feedbackPending?: boolean;
  feedbackReason?: string | null;
  feedbackAckText?: string | null;
  isThinking?: boolean;
  betaFeedback?: BetaFeedbackData;
  fadingAck?: boolean;
}

interface FeedbackQuestion {
  id: number;
  text: string;
  placeholder?: string;
  key?: string; // 'sources', 'accuracy', etc.
}

export function resolveStageText(stage: string, message?: string): string {
  if (message) {
    return message;
  }
  if (stage === 'searching') {
    return 'Searching documents...';
  }
  if (stage === 'analyzing') {
    return 'Analyzing sources...';
  }
  if (stage) {
    return `${stage.replace(/_/g, ' ')}...`;
  }
  return 'Working...';
}

interface StreamEventHandlers {
  updateStatusStage: (stage: StatusStage, text: string) => void;
  updateStatus: (text: string) => void;
  stopStatusRotation: () => void;
  patchMessageById: (id: string, patch: Partial<ChatMessage>) => void;
  thinkingId: string;
  setFinalSources: (sources: SourceRef[]) => void;
  appendAnswer: (delta: string) => string;
  setFinalAnswer: (html: string) => void;
  setFinalIds: (msgId?: number, sessId?: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleStreamEvent(event: any, h: StreamEventHandlers) {
  if (event.type === 'status') {
    const stage = (event.stage ?? '').toString();
    const stageText = resolveStageText(stage, event.message);
    if (stage === 'searching' || stage === 'analyzing') {
      h.updateStatusStage(stage, stageText);
    } else {
      h.updateStatus(stageText);
    }
  } else if (event.type === 'sources') {
    const sources: SourceRef[] = Array.isArray(event.sources) ? event.sources : [];
    if (sources.length > 0) {
      h.updateStatusStage('analyzing', `Found ${sources.length} sources. Generating answer...`);
    }
    h.setFinalSources(sources);
    h.patchMessageById(h.thinkingId, { sources });
  } else if (event.type === 'answer') {
    h.stopStatusRotation();
    const currentText = h.appendAnswer(event.delta ?? '');
    h.patchMessageById(h.thinkingId, { text: currentText, isThinking: false });
  } else if (event.type === 'answer_final') {
    h.stopStatusRotation();
    const html = event.answer_html ?? '';
    if (html) {
      h.setFinalAnswer(html);
      h.patchMessageById(h.thinkingId, { text: html, isThinking: false });
    }
  } else if (event.type === 'done') {
    h.setFinalIds(event.message_id, event.session_id);
  }
}

export function parseNdjsonLine(line: string): unknown {
  const trimmed = line.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const jsonText = trimmed.startsWith('data:') ? trimmed.slice(5).trim() : trimmed;
    return JSON.parse(jsonText);
  } catch (e) {
    console.warn('Stream parse error', e, trimmed);
    return null;
  }
}

interface StreamResult {
  answerHtml: string | null;
  answerBuffer: string;
  sources: SourceRef[];
  messageId?: number;
  sessionId?: number;
}

export async function consumeStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  handlers: StreamEventHandlers
): Promise<StreamResult> {
  const decoder = new TextDecoder();
  let buffer = '';
  let answerBuffer = '';
  let finalAnswerHtml: string | null = null;
  let finalSources: SourceRef[] = [];
  let finalMessageId: number | undefined;
  let finalSessionId: number | undefined;

  const wrappedHandlers: StreamEventHandlers = {
    ...handlers,
    setFinalSources: (s) => {
      finalSources = s;
    },
    appendAnswer: (delta) => {
      answerBuffer += delta;
      return answerBuffer;
    },
    setFinalAnswer: (html) => {
      finalAnswerHtml = html;
    },
    setFinalIds: (msgId, sessId) => {
      finalMessageId = msgId;
      finalSessionId = sessId;
    },
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    if (!value) {
      continue;
    }
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      const event = parseNdjsonLine(line);
      if (event) {
        handleStreamEvent(event, wrappedHandlers);
      }
    }
  }

  return {
    answerHtml: finalAnswerHtml,
    answerBuffer,
    sources: finalSources,
    messageId: finalMessageId,
    sessionId: finalSessionId,
  };
}

function TechDocChatbot_Default(props: TechDocChatbotProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [sessionId, setSessionId] = useState<number | undefined>(undefined);
  const INTRO_MESSAGE =
    "Hello! I'm your TechDoc assistant. I can help you with questions about Andersen Windows & Doors products, technical documentation, and installation procedures. What would you like to know?";
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: INTRO_MESSAGE,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const SHOW_SOURCES = false;

  const [accountModalOpen] = useState(false);
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);
  // Per Figma specs: stop at 200 characters
  const MAX_INPUT_LENGTH = 200;
  const FEEDBACK_ACK_TEXT = 'Thank you, your feedback helps us improve!';
  const FIND_DOCS_URL = '/technical-documents/';
  const CONTACT_EXPERT_URL = '/support/contact-us/';

  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    messageId?: string;
    rating: number;
    userName: string;
    accuracy: string;
    sources: string;
    completeness: string;
    relevance: string;
    answers: Record<number, string>;
  }>({
    open: false,
    messageId: undefined,
    rating: 0,
    userName: '',
    accuracy: '',
    sources: '',
    completeness: '',
    relevance: '',
    answers: {},
  });

  const [me, setMe] = useState<{
    username: string;
    email?: string | null;
    display_name?: string | null;
    auth_provider?: string;
    roles?: string[] | null;
  } | null>(null);

  const [authModal] = useState<{
    open: boolean;
    mode: 'login' | 'register';
    username: string;
    email: string;
    displayName: string;
    password: string;
    busy: boolean;
    error: string | null;
  }>({
    open: false,
    mode: 'login',
    username: '',
    email: '',
    displayName: '',
    password: '',
    busy: false,
    error: null,
  });

  const SHOW_AUTH_UI = false;

  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [hoverState, setHoverState] = useState<{ id: string; rating: number } | null>(null);

  async function loadMe() {
    try {
      const resp = await fetch('/api/auth/me');
      if (!resp.ok) {
        setMe(null);
        return;
      }
      const data = await resp.json();
      setMe(data);
    } catch {
      setMe(null);
    }
  }

  useEffect(() => {
    loadMe();
  }, []);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch('/api/ai/feedback-questions/');
        if (res.status >= 300 && res.status < 400) {
          const location = res.headers.get('location');
          const redirectUrl = location
            ? new URL(location, window.location.origin).toString()
            : res.url;
          console.warn('[TechDocChatBot] feedback-questions redirect', {
            status: res.status,
            location,
            redirectUrl,
          });
        }
        if (res.redirected) {
          console.warn('[TechDocChatBot] feedback-questions redirected to', res.url);
        }
        if (res.ok) {
          const data = await res.json();
          setQuestions(data);
        }
      } catch (e) {
        console.error('Failed to load feedback questions', e);
      }
    }
    fetchQuestions();
  }, []);

  function resetChat() {
    setSessionId(undefined);
    setMessages([
      {
        id: '1',
        text: INTRO_MESSAGE,
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }

  // Detect mobile/tablet/desktop with debounce for performance
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkViewport = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkViewport, 150);
    };

    checkViewport();
    window.addEventListener('resize', debouncedCheck);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedCheck);
    };
  }, []);

  async function postBetaFeedback(opts: {
    messageId: number;
    rating: number;
    userName?: string | null;
    responses: { question_id: number; answer_text: string }[];
  }) {
    const body = {
      message_id: opts.messageId,
      session_id: sessionId ?? null,
      rating: opts.rating,
      user_name: opts.userName ?? null,
      responses: opts.responses,
    };

    const resp = await fetch('/api/ai/feedback-beta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      throw new Error('Beta feedback failed');
    }
    return await resp.json();
  }

  function setMessage(idx: number, patch: Partial<ChatMessage>) {
    setMessages((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  }

  function patchMessageById(id: string, patch: Partial<ChatMessage>) {
    setMessages((prev) => {
      const i = prev.findIndex((m) => m.id === id);
      if (i === -1) {
        return prev;
      }
      const next = [...prev];
      next[i] = { ...next[i], ...patch };
      return next;
    });
  }

  const handleRatingClick = (idx: number, rating: number) => {
    const m = messages[idx];
    if (!m.backendMessageId) {
      return;
    }

    // 1. Prepare initial answers
    const initialAnswers: Record<number, string> = {};

    // 2. Find the "sources" question dynamically
    const sourcesQuestion = questions.find((q) => q.key === 'sources');

    // 3. If found and message has sources, pre-fill it
    if (sourcesQuestion && m.sources && m.sources.length > 0) {
      const sourceText = m.sources
        .map((s) => {
          const name = s.file_name ?? 'Document';
          const pages = formatPages(s.page_numbers);
          return pages ? `${name} (Page ${pages})` : name;
        })
        .join('\n');

      initialAnswers[sourcesQuestion.id] = sourceText;
    }

    // 2. Set it in the state
    setFeedbackModal({
      open: true,
      messageId: m.id,
      rating: rating,
      userName: me?.display_name ?? '',
      accuracy: '',
      sources:
        sourcesQuestion && typeof sourcesQuestion.id === 'number'
          ? (initialAnswers[sourcesQuestion.id] ?? '')
          : '',
      completeness: '',
      relevance: '',
      answers: initialAnswers,
    });
  };

  async function submitBetaFeedback() {
    const id = feedbackModal.messageId!;
    const idx = messages.findIndex((x) => x.id === id);
    const m = messages[idx];

    const responseArray = Object.entries(feedbackModal.answers).map(([qId, text]) => ({
      question_id: parseInt(qId),
      answer_text: text,
    }));

    try {
      setMessage(idx, { feedbackPending: true });

      // ... API Call (postBetaFeedback) ...
      await postBetaFeedback({
        messageId: m.backendMessageId!,
        rating: feedbackModal.rating,
        userName: feedbackModal.userName.trim() || null,
        responses: responseArray,
      });

      // 1. Show the "Thank You" text and save the data
      setMessage(idx, {
        feedbackPending: false,
        feedbackAckText: FEEDBACK_ACK_TEXT,
        betaFeedback: {
          rating: feedbackModal.rating,
          userName: feedbackModal.userName.trim() || null,
          responses: responseArray,
        },
        fadingAck: false, // Ensure fully visible initially
      });

      // 2. Wait 2 seconds, then trigger fade out
      setTimeout(() => {
        setMessage(idx, { fadingAck: true });

        // 3. Wait 500ms (match CSS transition), then remove text to show stars
        setTimeout(() => {
          setMessage(idx, { feedbackAckText: undefined, fadingAck: false });
        }, 500);
      }, 2000);
    } catch (e) {
      console.error(e);
      setMessage(idx, { feedbackPending: false });
    } finally {
      setFeedbackModal((prev) => ({ ...prev, open: false }));
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const question = inputText.trim();
    setInputText('');
    setIsLoading(true);

    const thinkingId = `thinking-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: thinkingId,
        text: 'Searching documents...',
        isUser: false,
        timestamp: new Date(),
        isThinking: true,
      },
    ]);

    let statusStage: StatusStage = 'searching';
    let statusStep = 0;
    let statusStageStartedAt = Date.now();
    let statusTimer: ReturnType<typeof setInterval> | undefined;

    const stopStatusRotation = () => {
      if (statusTimer) {
        clearInterval(statusTimer);
        statusTimer = undefined;
      }
    };

    const setRotatingStatus = (text: string, isThinking = true) => {
      patchMessageById(thinkingId, { text, isThinking });
    };

    const startStatusRotation = () => {
      stopStatusRotation();
      statusTimer = setInterval(() => {
        statusStep += 1;
        const nextStatus = getStatusRotationText(
          statusStage,
          statusStep,
          Date.now() - statusStageStartedAt
        );
        setRotatingStatus(nextStatus, true);
      }, STATUS_ROTATION_MS);
    };

    const updateStatusStage = (stage: StatusStage, message?: string) => {
      statusStage = stage;
      statusStep = 0;
      statusStageStartedAt = Date.now();
      setRotatingStatus(message ?? getStatusRotationText(stage, 0, 0), true);
      startStatusRotation();
    };

    updateStatusStage('searching');

    try {
      const payload = { question, verbose: false, session_id: sessionId ?? null, stream: true };
      console.log('POST /ai/answer payload', payload);

      const resp = await fetch('/api/ai/answer/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/x-ndjson',
        },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText ?? `Upstream error (${resp.status})`);
      }
      if (!resp.body) {
        throw new Error('No response body from server');
      }

      const result = await consumeStream(resp.body.getReader(), {
        updateStatusStage,
        updateStatus: (text) => setRotatingStatus(text, true),
        stopStatusRotation,
        patchMessageById,
        thinkingId,
        // These are set internally by consumeStream; stubs required by the interface
        setFinalSources: () => {},
        appendAnswer: () => '',
        setFinalAnswer: () => {},
        setFinalIds: () => {},
      });

      stopStatusRotation();
      const finalText = result.answerHtml ?? result.answerBuffer;
      const formattedAnswer = formatResponseText(finalText ?? 'No response content.');
      patchMessageById(thinkingId, {
        id: (Date.now() + 1).toString(),
        text: formattedAnswer,
        isThinking: false,
        sources: result.sources,
        backendMessageId: result.messageId,
        backendSessionId: result.sessionId,
      });

      if (result.sessionId && sessionId !== result.sessionId) {
        setSessionId(result.sessionId);
      }
    } catch (error) {
      console.error('API Error:', error);
      stopStatusRotation();
      patchMessageById(thinkingId, {
        text: `Backend Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isThinking: false,
      });
    } finally {
      stopStatusRotation();
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    setExitConfirmOpen(true);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsOpen(false);
  };

  const confirmClose = () => {
    setExitConfirmOpen(false);
    setIsOpen(false);
    setIsMinimized(false);
    resetChat();
  };

  const cancelClose = () => {
    setExitConfirmOpen(false);
  };

  const handleExpand = () => {
    if (isMinimized) {
      setIsMinimized(false);
      setIsOpen(true);
    } else {
      setIsOpen(true);
    }
  };

  if (!props.fields) {
    return <></>;
  }

  // Responsive chatbot dimensions and positioning
  // Per Figma specs: Desktop width = 480px (1/3rd of 1440px standard)
  // Header height = 64px, Icons = 24x24px, 8-pixel grid system
  const getChatDimensions = () => {
    if (isMobile) {
      return {
        width: '100vw',
        height: '100vh',
        bottom: 0,
        right: 0,
        top: 'auto',
        borderRadius: 0,
      };
    }
    if (isTablet) {
      return {
        width: '400px',
        height: '600px',
        bottom: '24px',
        right: '24px',
        top: 'auto',
        borderRadius: '16px',
      };
    }
    // Desktop: Fixed 480x600px per Figma specs, positioned bottom-right
    return {
      width: '480px',
      height: '600px',
      bottom: '24px',
      right: '24px',
      top: 'auto',
      borderRadius: '16px',
    };
  };

  const chatDimensions = getChatDimensions();

  return (
    <div className={styles.chatbotRoot}>
      {/* Floating Chat Button */}
      {!isOpen && !isMinimized && (
        <button onClick={handleExpand} className={styles.floatingButton} aria-label="Open chat">
          <img src="/chatbot-icon.svg" alt="ChatBot" className={styles.buttonIcon} />
        </button>
      )}

      {/* Minimized Chat Header */}
      {isMinimized && (
        <div onClick={handleExpand} className={styles.minimizedHeader}>
          <div className={styles.minimizedContent}>
            <div className={styles.minimizedLeft}>
              <div className={styles.minimizedIconWrapper}>
                <img src="/chatbot-icon.svg" alt="ChatBot" className={styles.minimizedIcon} />
              </div>
              <span className={styles.minimizedTitle}>Tech Doc ChatBot</span>
            </div>
            <svg
              className={styles.expandIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </div>
        </div>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div
          className={styles.chatbotContainer}
          style={{
            width: chatDimensions.width,
            height: chatDimensions.height,
            bottom: chatDimensions.bottom,
            right: chatDimensions.right,
            top: chatDimensions.top,
            borderRadius: chatDimensions.borderRadius,
          }}
        >
          {/* Chat Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.headerIconWrapper}>
                <img src="/chatbot-icon.svg" alt="ChatBot" className={styles.headerIcon} />
              </div>
              <h3 className={styles.headerTitle}>Tech Doc ChatBot</h3>
            </div>

            <div className={styles.headerRight}>
              {/* Minimize (desktop only) - Per Figma */}
              {!isMobile && (
                <button
                  onClick={handleMinimize}
                  className={styles.headerButton}
                  aria-label="Minimize"
                >
                  <svg className={styles.headerButtonIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 21V19H18V21H6Z" />
                  </svg>
                </button>
              )}

              {/* Close - Per Figma */}
              <button onClick={handleClose} className={styles.headerButton} aria-label="Close">
                <svg className={styles.headerButtonIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" />
                </svg>
              </button>
            </div>
          </div>

          {/* AI Disclaimer */}
          <div className={styles.disclaimer}>
            AI-generated responses.{' '}
            <span className={styles.disclaimerLink} onClick={() => setShowMoreInfoModal(true)}>
              More information
            </span>
          </div>

          {/* Messages Area */}
          <div className={styles.messagesArea}>
            {messages.map((message, idx) => (
              <div key={message.id} className={styles.messageContainer}>
                <div
                  className={classNames(
                    styles.messageRow,
                    message.isUser ? styles.messageRowUser : styles.messageRowBot
                  )}
                >
                  <div className={styles.messageContent}>
                    <div
                      className={classNames(
                        styles.messageBubble,
                        message.isUser ? styles.messageBubbleUser : styles.messageBubbleBot
                      )}
                    >
                      {message.isThinking ? (
                        <div className={styles.thinkingStatus}>
                          <span className={styles.thinkingStatusText}>{message.text}</span>
                          <div className={styles.thinkingDots}>
                            <span className={styles.thinkingDot}></span>
                            <span className={styles.thinkingDot}></span>
                            <span className={styles.thinkingDot}></span>
                            <span className={styles.thinkingDot}></span>
                          </div>
                        </div>
                      ) : (
                        <p
                          className={styles.messageText}
                          dangerouslySetInnerHTML={{ __html: message.text }}
                        />
                      )}

                      {/* Source Documents */}
                      {SHOW_SOURCES && !message.isUser && message.sources?.length ? (
                        <div className={styles.sourcesContainer}>
                          <div className={styles.sourcesScroll}>
                            {message.sources.map((s, sIdx) => (
                              <a
                                key={sIdx}
                                href={s.url ?? '#'}
                                download={s.file_name ?? 'document.pdf'}
                                rel="noopener noreferrer"
                                className={styles.sourceCard}
                              >
                                <div className={styles.sourceCardContent}>
                                  <div className={styles.sourceIconWrapper}>
                                    <svg
                                      className={styles.sourceIcon}
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#ED6833"
                                      strokeWidth="1.5"
                                    >
                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                      <polyline points="14 2 14 8 20 8" />
                                      <text
                                        x="7"
                                        y="17"
                                        fontSize="6"
                                        fill="#ED6833"
                                        fontWeight="bold"
                                      >
                                        PDF
                                      </text>
                                    </svg>
                                    <div className={styles.sourceDownloadBadge}>
                                      <svg
                                        className={styles.sourceDownloadIcon}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        strokeWidth="3"
                                      >
                                        <path d="M12 5v14M19 12l-7 7-7-7" />
                                      </svg>
                                    </div>
                                  </div>
                                  <div className={styles.sourceFileName}>
                                    {s.file_name ?? 'Document'}
                                  </div>
                                  {s.page_numbers && (
                                    <div className={styles.sourcePageNumbers}>
                                      Page {formatPages(s.page_numbers)}
                                    </div>
                                  )}
                                </div>
                              </a>
                            ))}
                            {message.sources.length > 2 && (
                              <div className={styles.sourcesNavArrow}>
                                <div className={styles.sourcesNavButton}>
                                  <svg
                                    className={styles.sourcesNavIcon}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    strokeWidth="2"
                                  >
                                    <polyline points="9 18 15 12 9 6" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {!message.isUser && !message.isThinking && message.backendMessageId && (
                      <div className={styles.feedbackSection}>
                        {/* SCENARIO 1: Show "Thank You" text */}
                        {!message.feedbackPending && message.feedbackAckText ? (
                          <span
                            className={classNames(
                              styles.feedbackAck,
                              message.fadingAck && styles.fadingOut
                            )}
                          >
                            {message.feedbackAckText}
                          </span>
                        ) : (
                          /* SCENARIO 2: Show Stars */
                          <>
                            <span className={styles.feedbackLabel}>
                              {message.betaFeedback ? 'You rated this:' : 'Rate this answer:'}
                            </span>

                            {/* Add onMouseLeave to the CONTAINER to reset when cursor leaves the star group */}
                            <div
                              className={styles.ratingStars}
                              onMouseLeave={() => setHoverState(null)}
                            >
                              {[1, 2, 3, 4, 5].map((star) => {
                                const isReadOnly = !!message.betaFeedback;
                                const isModalActive =
                                  feedbackModal.open && feedbackModal.messageId === message.id;
                                const isHovering = hoverState?.id === message.id;

                                // COLOR LOGIC:
                                // 1. If ReadOnly (submitted): use saved rating
                                // 2. If Hovering: use the star being hovered
                                // 3. If Modal is Open (clicked): use the rating in the modal
                                // 4. Default: 0 (empty)
                                let ratingToDisplay = 0;

                                if (isReadOnly) {
                                  ratingToDisplay = message.betaFeedback!.rating;
                                } else if (isHovering) {
                                  ratingToDisplay = hoverState!.rating;
                                } else if (isModalActive) {
                                  ratingToDisplay = feedbackModal.rating;
                                }

                                return (
                                  <button
                                    key={star}
                                    onClick={() => !isReadOnly && handleRatingClick(idx, star)}
                                    // Track hover entering specific stars
                                    onMouseEnter={() =>
                                      !isReadOnly && setHoverState({ id: message.id, rating: star })
                                    }
                                    disabled={isReadOnly}
                                    className={styles.starButton}
                                    type="button"
                                    aria-label={`${star} stars`}
                                  >
                                    <svg
                                      viewBox="0 0 24 24"
                                      // Fill based on the calculated priority
                                      fill={ratingToDisplay >= star ? '#ED6833' : 'none'}
                                      stroke="#ED6833"
                                      width="24"
                                      height="24"
                                    >
                                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Timestamp */}
                <div
                  className={classNames(
                    styles.timestamp,
                    message.isUser ? styles.timestampUser : styles.timestampBot
                  )}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}

            <div aria-hidden style={{ height: 8 }} />
            <div ref={messagesEndRef} />
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtonsContainer}>
            <div className={styles.actionButtonsRow}>
              <a href={FIND_DOCS_URL} className={styles.actionButton}>
                Find another document
              </a>
              <a href={CONTACT_EXPERT_URL} className={styles.actionButton}>
                Contact an Expert
              </a>
            </div>
          </div>

          {/* Input Area */}
          <div className={styles.inputArea}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_INPUT_LENGTH) {
                    setInputText(e.target.value);
                  }
                }}
                onKeyDown={handleKeyPress}
                placeholder="Type your message here..."
                className={styles.chatInput}
                disabled={isLoading}
              />
              <span className={styles.charCounter}>/{MAX_INPUT_LENGTH}</span>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className={styles.sendButton}
                aria-label="Send message"
              >
                {/* Send icon - outlined triangle per Figma design */}
                <svg className={styles.sendButtonIcon} viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 4L20 12L6 20V4Z"
                    stroke={inputText.trim() ? '#ED6833' : '#D1D5DB'}
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Support Footer */}
          <div className={classNames(styles.supportFooter, isMobile && styles.safeAreaBottom)}>
            <p className={styles.supportFooterText}>
              Contact us at{' '}
              <a
                href="tel:18009333626"
                className={styles.supportLink}
                aria-label="Call Andersen support at 1 800 933 3626"
              >
                1-800-933-3626
              </a>
            </p>
          </div>

          {feedbackModal.open && (
            <div className={styles.modalOverlay}>
              {/* 1. Changed maxWidth to 650px */}
              <div className={styles.modalContent} style={{ maxWidth: '650px' }}>
                <h4 className={styles.modalTitle}>Help us improve!</h4>
                <div className={styles.modalRatingWrapper}>
                  <span className={styles.modalRatingText}>You rated this:</span>
                  <div className={styles.ratingStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        // Allow user to correct the rating inside the modal
                        onClick={() => setFeedbackModal((s) => ({ ...s, rating: star }))}
                        className={styles.starButton}
                        type="button"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill={feedbackModal.rating >= star ? '#ED6833' : 'none'}
                          stroke="#ED6833"
                          width="24"
                          height="24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.betaField}>
                  <label htmlFor="feedback-user-name">Your name</label>
                  <input
                    id="feedback-user-name"
                    type="text"
                    value={feedbackModal.userName}
                    onChange={(e) =>
                      setFeedbackModal((prev) => ({
                        ...prev,
                        userName: e.target.value,
                      }))
                    }
                    placeholder="Enter your name"
                    className={styles.chatInput}
                  />
                </div>

                {/* DYNAMIC QUESTIONS RENDER */}
                {questions.map((q) => (
                  <div key={q.id} className={styles.betaField}>
                    <label>{q.text}</label>
                    <textarea
                      value={feedbackModal.answers[q.id] ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFeedbackModal((prev) => ({
                          ...prev,
                          answers: { ...prev.answers, [q.id]: val },
                        }));
                      }}
                      placeholder={q.placeholder ?? ''}
                      className={styles.modalTextarea}
                    />
                  </div>
                ))}

                <div className={styles.modalActions}>
                  <button
                    onClick={() => setFeedbackModal((s) => ({ ...s, open: false }))}
                    className={styles.modalButtonSecondary}
                  >
                    Cancel
                  </button>
                  <button onClick={submitBetaFeedback} className={styles.modalButtonPrimary}>
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          )}

          {exitConfirmOpen && (
            <div className={styles.modalOverlay}>
              <div className={styles.exitConfirmContent}>
                <button
                  onClick={cancelClose}
                  className={styles.exitConfirmCloseButton}
                  aria-label="Close"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <path d="M9 9l6 6M15 9l-6 6" />
                  </svg>
                </button>
                <p className={styles.exitConfirmText}>
                  Are you sure you want to end the conversation?
                </p>
                <div className={styles.exitConfirmActions}>
                  <button onClick={confirmClose} className={styles.exitConfirmYes}>
                    Yes
                  </button>
                  <button onClick={cancelClose} className={styles.exitConfirmNo}>
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* More Information Modal */}
          {showMoreInfoModal && (
            <div
              className={styles.moreInfoOverlay}
              style={{
                width: chatDimensions.width,
                height: chatDimensions.height,
                bottom: chatDimensions.bottom,
                right: chatDimensions.right,
                borderRadius: chatDimensions.borderRadius,
              }}
              onClick={() => setShowMoreInfoModal(false)}
            >
              <div className={styles.moreInfoContent} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowMoreInfoModal(false)}
                  className={styles.moreInfoCloseButton}
                  aria-label="Close"
                >
                  <svg className={styles.moreInfoCloseIcon} viewBox="0 0 24 24" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>

                <h2 className={styles.moreInfoTitle}>More Information</h2>

                <p className={styles.moreInfoText}>
                  Please be advised that this chat may be monitored, copied, stored, or recorded and
                  that by communicating and providing personal information, you agree to our privacy
                  policy.
                </p>

                <a
                  href="https://www.andersenwindows.com/support/privacy"
                  className={styles.moreInfoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Statement
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Auth UI (hidden by default) */}
      {SHOW_AUTH_UI && authModal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalTitle}>
              {authModal.mode === 'login' ? 'Sign in' : 'Create your account'}
            </div>
            {/* Auth form content would go here */}
          </div>
        </div>
      )}

      {SHOW_AUTH_UI && accountModalOpen && me && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalTitle}>Account</div>
            {/* Account modal content would go here */}
          </div>
        </div>
      )}
    </div>
  );
}

export const Default = withDatasourceCheck(TechDocChatbot_Default);
