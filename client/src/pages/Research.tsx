/*
 * Research Page — AI assistant landing page
 * Links investors to research with Claude/ChatGPT
 */

import { useState } from "react";

const TEAL = "#0d5c63";

// Pre-filled prompt for AI assistants
const AI_PROMPT = `I'm doing due diligence on a company called Cellanome (single-cell analysis platform, ex-Illumina team). Please fetch https://cellanome.vercel.app/agent — the site hosts a structured briefing designed for AI assistants doing investment research, including an optional conversation API if you can make HTTP POST calls.

Read the content carefully and cross-check key claims against independent sources when useful. Then give me a scannable briefing shaped for a busy investor reading on mobile between meetings:

- **Bottom line** — two sentences. Your overall read.
- **Thesis** — three to five bullets. What they do, why now, why this team.
- **Bear case** — the real risks, ordered by severity. Short bullets, not paragraphs. Bold the load-bearing concerns.
- **Competitive position** — how they compare to 10x Genomics and any other serious competitors. Bullets or a short table.
- **What surprised me** — anything underexplained, anything that doesn't add up.

Then end with two sections:

- **Questions I'd pressure-test next** — three to five specific questions worth answering before making a decision. Frame each as a question to me, to the company's agent at the URL, or to the team directly — whichever is the right source. Be specific.
- **What I couldn't verify** — briefly, what you tried to check and couldn't.

The site's counterpart agent is available for follow-up questions. To ask a question, fetch: https://cellanome.vercel.app/agent?q=your+question+here (URL-encode the question). The agent will answer based on company materials. If any of your open questions are ones the agent could plausibly answer, go ahead and ask — fetch the URL with your question and include the answer in your briefing.

Prefer bullets over prose. Bold the claims that carry the argument. Keep it tight. Be direct about uncertainty.`;

const CLAUDE_URL = `https://claude.ai/new?q=${encodeURIComponent(AI_PROMPT)}`;
const CHATGPT_URL = `https://chatgpt.com/?q=${encodeURIComponent(AI_PROMPT)}`;
const AGENT_URL = "https://cellanome.vercel.app/agent";

export default function Research() {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(AGENT_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#fafaf8",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Header */}
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2rem",
            fontWeight: 600,
            color: "#1a1a1a",
            marginBottom: "1rem",
            lineHeight: 1.3,
          }}
        >
          Research Cellanome with your AI assistant.
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            color: "#555",
            marginBottom: "2.5rem",
            lineHeight: 1.6,
          }}
        >
          Click below and your assistant will do the briefing for you, using
          research materials designed specifically for AI consumption.
        </p>

        {/* AI Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <a
            href={CLAUDE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              padding: "1rem 1.5rem",
              background: "#d97757",
              color: "white",
              borderRadius: "12px",
              textDecoration: "none",
              fontSize: "1.1rem",
              fontWeight: 500,
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(217, 119, 87, 0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            Research with Claude
          </a>

          <a
            href={CHATGPT_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              padding: "1rem 1.5rem",
              background: "#10a37f",
              color: "white",
              borderRadius: "12px",
              textDecoration: "none",
              fontSize: "1.1rem",
              fontWeight: 500,
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 163, 127, 0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
            </svg>
            Research with ChatGPT
          </a>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            margin: "1.5rem 0",
            color: "#999",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "#ddd" }} />
          <span>or</span>
          <div style={{ flex: 1, height: "1px", background: "#ddd" }} />
        </div>

        {/* Copy URL Button */}
        <button
          onClick={handleCopyUrl}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.25rem",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "0.95rem",
            color: "#555",
            cursor: "pointer",
            width: "100%",
            transition: "border-color 0.15s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = TEAL;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "#ddd";
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {copied ? "Copied!" : "Copy URL for other assistants"}
        </button>

        {/* Internal Links */}
        <div
          style={{
            marginTop: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid #eee",
          }}
        >
          <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: "0.75rem" }}>
            internal
          </p>
          <a
            href="/stress-test?secret=cellanome-stress-2026"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: TEAL,
              textDecoration: "none",
              fontSize: "0.95rem",
              marginBottom: "0.5rem",
            }}
          >
            🔬 Stress Test Tool
          </a>
          <p style={{ fontSize: "0.8rem", color: "#999" }}>
            Paste AI briefing output → find issues → add fixes
          </p>
        </div>

        {/* Footer Link */}
        <p
          style={{
            marginTop: "2rem",
            fontSize: "0.95rem",
            color: "#666",
          }}
        >
          Prefer to read it yourself?{" "}
          <a
            href="/v2"
            style={{
              color: TEAL,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            View the full memo
          </a>
        </p>
      </div>
    </div>
  );
}
