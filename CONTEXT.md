# Cellanome — AI-Powered Investor Research Platform

## What This Is
An interactive investment research report for Cellanome (single-cell analysis company) that's designed for both humans AND AI assistants to read and analyze.

**Live:** https://cellanome.vercel.app

## The Concept: "llms.txt for Investor Relations"
Companies can publish structured, AI-readable research materials that any investor's AI assistant can fetch, analyze, and answer questions about.

### Key URLs
- `/` — Main report (human-readable, editorial design)
- `/v2` — Full memo (alternate layout)
- `/research` — AI research landing page with "Research with Claude/ChatGPT" buttons
- `/agent` — Structured data endpoint for AI consumption
- `/agent?q=...` — Q&A API endpoint
- `/stress-test?secret=cellanome-stress-2026` — Internal tool to test AI output quality

## Tech Stack
- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + Radix UI components
- **Charts:** Recharts for data visualization
- **Backend:** Express.js (minimal API layer)
- **Design:** "Nature Portfolio" editorial theme (teal #0d5c63, amber #e8a020)
- **Fonts:** Playfair Display (headers) + DM Sans (body)

## Project Structure
```
cellanome/
├── client/src/           # React frontend
│   ├── pages/Home.tsx    # Main report page
│   └── components/       # UI components
├── api/chat.ts           # Vercel serverless chat endpoint
├── knowledge_base.json   # Structured company data for AI
├── KNOWLEDGE_BASE.md     # Markdown version of knowledge base
└── vercel.json           # Deployment config
```

## Related Projects
- `investor-ai-platform/` — Earlier iteration (Next.js based)
- The `/research` page exists on prod but NOT in the codebase (built by Manus, deployed directly)

## Codebase Notes
- The `/research` route needs to be created in the codebase
- Chat API uses knowledge_base.json for Q&A
- Vercel deploys from `dist/public`

## GitHub
- Repo: `thesolster/cellanome`
- Clone: `gh repo clone thesolster/cellanome`

## Development
```bash
cd cellanome
pnpm install
pnpm dev        # Start dev server
pnpm build      # Build for production
```

## Deploy
```bash
vercel --prod
```

## Key Investor Q&A Data Points
- **Company:** Cellanome, Inc. (Foster City, CA)
- **Founded:** 2020
- **Total Raised:** $213M+ (Series B $150M Jan 2024)
- **Employees:** ~105
- **Technology:** CellCage™ + R3200 platform
- **Key Team:** Mostafa Ronaghi (Co-founder), Jay Flatley (Board Chair), Omead Ostadan (CEO)
- **Lead Investors:** Premji Invest, DFJ Growth
- **Patents:** 7 granted (US)
- **Scientific Validation:** Science paper Dec 2025

## TODO
- [ ] Add `/research` route to codebase
- [ ] Wire up Q&A API to proper endpoint
- [ ] Add conversation persistence
- [ ] Analytics dashboard for investor engagement
