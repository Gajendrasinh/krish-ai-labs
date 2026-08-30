// Dev-only stub for POST /api/chat, so the ChatWidget is testable locally
// before a real backend exists. Only wired into `vite dev` (via
// configureServer) — it is NOT part of the production build, and
// `vite preview` does not run it either. Swap the real backend's URL into
// ChatWidget.jsx's CHAT_ENDPOINT when one exists; this file can then be
// deleted along with its use in vite.config.js.
//
// Retrieval here is a crude keyword match over a handful of snippets
// pulled from the site's own copy — good enough to prove the request/
// response contract end to end, not a real RAG pipeline.

const KNOWLEDGE_BASE = [
  {
    keywords: ['service', 'services', 'offer', 'do you', 'what do'],
    reply:
      "We offer AI & GenAI development, full-stack software development, AI agents & automation, RAG & LLM applications, cloud solutions, and technical consulting. Want details on any of those? Check the Services page for the full breakdown.",
  },
  {
    keywords: ['portfolio', 'project', 'example', 'work', 'case stud'],
    reply:
      "We have three sample projects on the Portfolio page: an Internal Knowledge Assistant (RAG), an AI Customer Support Agent, and a SaaS Operations Dashboard. Krish AI Labs is a new studio, so these are illustrative builds rather than delivered client work.",
  },
  {
    keywords: ['founder', 'about', 'heena', 'who are you', 'who is'],
    reply:
      "Krish AI Labs was founded by Heena Zala, a software engineer with 4 years of experience in full-stack development and AI-powered solutions. You can read more on the About page.",
  },
  {
    keywords: ['price', 'pricing', 'cost', 'quote', 'rate'],
    reply:
      "Pricing depends on scope — the fastest way to get a number is the Contact page. Tell us what you're building and we typically respond within a day.",
  },
  {
    keywords: ['contact', 'email', 'reach', 'talk', 'hire'],
    reply:
      "You can reach us at hello@krishailabs.com or through the form on the Contact page — we typically respond within 24 hours.",
  },
  {
    keywords: ['rag', 'retrieval', 'llm', 'ai agent', 'genai', 'agent'],
    reply:
      "We build RAG systems that ground LLM answers in your own documents and data, plus autonomous AI agents for workflows like support triage and document processing. See the Services page for the technical scope.",
  },
];

const DEFAULT_REPLY =
  "I'm a local dev stub standing in for the real backend — I can only match a few keywords right now (try \"services\", \"portfolio\", \"pricing\", or \"contact\"). Wire a real endpoint into CHAT_ENDPOINT in ChatWidget.jsx to replace me.";

function craftReply(message) {
  const lower = message.toLowerCase();
  const hit = KNOWLEDGE_BASE.find((entry) => entry.keywords.some((kw) => lower.includes(kw)));
  return hit ? hit.reply : DEFAULT_REPLY;
}

export default function chatStubPlugin() {
  return {
    name: 'chat-stub-dev-middleware',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          let message = '';
          try {
            message = String(JSON.parse(body || '{}').message || '');
          } catch {
            // ignore malformed body, fall through to default reply
          }
          // Simulate latency so the pending/typing state is visible.
          setTimeout(() => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ reply: craftReply(message) }));
          }, 500);
        });
      });
    },
  };
}
