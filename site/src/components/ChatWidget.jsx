import { useEffect, useRef, useState } from 'react';
import './ChatWidget.css';

/**
 * Site-wide AI chat widget.
 *
 * This talks to a backend RAG endpoint at POST /api/chat — that endpoint
 * doesn't exist yet, so calls here currently fail and the widget falls
 * back to a friendly "not connected yet" message. Point CHAT_ENDPOINT at
 * a real backend (same-origin path, or a full URL) to bring it to life.
 *
 * Expected contract:
 *
 *   POST {CHAT_ENDPOINT}
 *   Request  { message: string, history: { role: 'user' | 'assistant', content: string }[] }
 *   Response { reply: string }
 *   Errors   any non-2xx status, or a body without a string `reply`, is
 *            treated as a failure and shown as the fallback message below.
 *
 * The backend is expected to do the actual retrieval — grounding replies
 * in this site's services/portfolio/about content (and whatever else you
 * feed it) — the frontend here is transport-only and holds no site data
 * or API keys.
 */
const CHAT_ENDPOINT = '/api/chat';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content:
    "Hi! I'm the Krish AI Labs assistant. Ask me about our services, past projects, or how to get a quote.",
};

const FALLBACK_MESSAGE =
  "I can't reach the assistant backend right now. In the meantime, reach us through the Contact page and we'll get back to you within a day.";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const threadRef = useRef(null);

  useEffect(() => {
    if (!threadRef.current) return;
    threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages, open, pending]);

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || pending) return;

    const history = messages.map(({ role, content }) => ({ role, content }));
    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setPending(true);

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });
      if (!res.ok) throw new Error(`chat backend responded ${res.status}`);
      const data = await res.json();
      if (typeof data.reply !== 'string') throw new Error('malformed chat response');
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.warn('[chat] request failed:', err);
      setMessages((prev) => [...prev, { role: 'assistant', content: FALLBACK_MESSAGE, isFallback: true }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-panel" role="dialog" aria-label="Krish AI Labs assistant">
          <div className="chat-panel-header">
            <div>
              <span className="chat-panel-title">Krish AI Labs Assistant</span>
              <span className="chat-panel-subtitle">AI-powered · grounded in our site content</span>
            </div>
            <button
              type="button"
              className="chat-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className="chat-thread" ref={threadRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-bubble chat-bubble-${m.role}${m.isFallback ? ' chat-bubble-fallback' : ''}`}
              >
                {m.content}
              </div>
            ))}
            {pending && (
              <div className="chat-bubble chat-bubble-assistant chat-bubble-pending">
                <span className="chat-dot" />
                <span className="chat-dot" />
                <span className="chat-dot" />
              </div>
            )}
          </div>

          <form className="chat-input-row" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our services…"
              aria-label="Message"
              disabled={pending}
            />
            <button type="submit" className="chat-send" disabled={pending || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="chat-fab"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Open chat with our AI assistant'}
      >
        {open ? (
          '×'
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 5.5C4 4.67 4.67 4 5.5 4h13c.83 0 1.5.67 1.5 1.5v10c0 .83-.67 1.5-1.5 1.5H9l-4 3.5v-3.5H5.5A1.5 1.5 0 0 1 4 15.5v-10Z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
