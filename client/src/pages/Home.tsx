/*
 * DESIGN: Editorial Life Sciences — "Nature Portfolio"
 * Primary: Deep Teal (#0d5c63), Accent: Warm Amber (#e8a020)
 * Typography: Playfair Display (headers) + DM Sans (body)
 * Interactive charts via Recharts. Sticky left TOC on desktop.
 */

import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { ChatWidget } from "../components/ChatWidget";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663472641300/K5mWdhyLJsTfXciYHgwbMq/cellanome_hero-Z5CRFUWvdk3eJsaaRZJvz7.webp";
const TECH_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663472641300/K5mWdhyLJsTfXciYHgwbMq/cellanome_tech_diagram-2REzjCi5HMh9zj4RzL6fgg.webp";

const TEAL = "#0d5c63";
const AMBER = "#e8a020";
const TEAL_LIGHT = "#1a8a96";
const TEAL_PALE = "#e8f4f5";

// ── Data ──────────────────────────────────────────────────────────────────────

const fundingData = [
  { round: "Seed/A", year: "2020–22", amount: 63, investors: "8VC, DCVC, SV Angel" },
  { round: "Series B", year: "Jan 2024", amount: 150, investors: "Premji, DFJ, Wing" },
  { round: "Series C*", year: "2025–26", amount: 90, investors: "Ongoing" },
];

const marketSizeData = [
  { year: "2022", singleCell: 3.1, multiOmics: 4.2 },
  { year: "2023", singleCell: 3.6, multiOmics: 5.1 },
  { year: "2024", singleCell: 4.3, multiOmics: 6.2 },
  { year: "2025", singleCell: 5.0, multiOmics: 7.5 },
  { year: "2026E", singleCell: 5.8, multiOmics: 8.9 },
  { year: "2028E", singleCell: 7.8, multiOmics: 11.5 },
  { year: "2030E", singleCell: 10.8, multiOmics: 13.2 },
];

const competitorRadarData = [
  { metric: "Live-Cell Tracking", Cellanome: 95, "10x Genomics": 20, "Bruker/Berkeley": 70, "Parse Bio": 10 },
  { metric: "Transcriptomics", Cellanome: 90, "10x Genomics": 95, "Bruker/Berkeley": 40, "Parse Bio": 88 },
  { metric: "Throughput", Cellanome: 80, "10x Genomics": 85, "Bruker/Berkeley": 50, "Parse Bio": 90 },
  { metric: "Multi-modal", Cellanome: 92, "10x Genomics": 60, "Bruker/Berkeley": 55, "Parse Bio": 35 },
  { metric: "Cell Interaction", Cellanome: 90, "10x Genomics": 15, "Bruker/Berkeley": 65, "Parse Bio": 5 },
  { metric: "IP Moat", Cellanome: 85, "10x Genomics": 90, "Bruker/Berkeley": 70, "Parse Bio": 50 },
];

const patentTimeline = [
  { year: "2022", patent: "US 11,554,370", title: "Devices and methods for analyzing biological samples (foundational)", type: "Grant" },
  { year: "2024", patent: "US 12,151,242", title: "Selective photopolymerization energy delivery for polymer matrix generation", type: "Grant" },
  { year: "2025 (Apr)", patent: "US 12,440,837", title: "Fluidic device analyte processing with optical energy source", type: "Grant" },
  { year: "2025 (Nov)", patent: "WO 2025/229401", title: "Systems for screening biological components using hydrogel chambers", type: "PCT" },
  { year: "2026 (Mar)", patent: "US 12,569,847", title: "Detecting intercellular interactions of cells in compartments", type: "Grant" },
  { year: "2026 (Mar)", patent: "US 12,576,399", title: "Imaging and analyzing a cell in a compartment of a fluidic device", type: "Grant" },
  { year: "2026 (Mar)", patent: "US 12,576,400", title: "Incubating and analyzing a cell in a compartment of a fluidic device", type: "Grant" },
];

const teamData = [
  { name: "Omead Ostadan", role: "CEO", prior: "Chief Product & Marketing Officer, Illumina", focus: "Commercial scale-up, go-to-market strategy" },
  { name: "Mostafa Ronaghi, Ph.D.", role: "Co-founder & Board Member", prior: "CTO, Illumina (2008–2021); Inventor of pyrosequencing", focus: "Technology vision, scientific strategy" },
  { name: "Jay Flatley", role: "Board Chair", prior: "CEO & Executive Chairman, Illumina", focus: "Strategic guidance, investor relations" },
  { name: "Gary Schroth, Ph.D.", role: "Chief Science Officer", prior: "Distinguished Scientist, Illumina", focus: "Multi-omics applications, scientific publications" },
];

const applicationAreas = [
  { area: "Immuno-oncology", desc: "Identify cytotoxic T-cells by observing tumor-killing behavior, then sequence only the effective cells — dramatically improving CAR-T and TCR therapy development." },
  { area: "Drug Resistance", desc: "Observe how cancer cell clones respond to EGFR inhibitors over time, then sequence resistant clones to identify the molecular mechanisms of resistance." },
  { area: "Cell Therapy QC", desc: "Multi-modal characterization of cell therapy products — linking functional potency to transcriptomic identity for regulatory submissions." },
  { area: "Epigenetics", desc: "Measure the persistence of gene expression programs across tens of thousands of expanding clones — 1000× more colonies than well-based methods." },
  { area: "Dendritic Cell Biology", desc: "Unveil genes in dendritic cells that enhance T-cell priming through functional multiplexed single cell-cell interaction analysis." },
  { area: "Stem Cell Research", desc: "Long-term clonal expansion of human iPSCs and mouse hematopoietic stem cells within CellCage enclosures, followed by transcriptomic profiling." },
];

const SECTIONS = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "technology", label: "Technology" },
  { id: "team", label: "Team & Leadership" },
  { id: "funding", label: "Funding" },
  { id: "market", label: "Market Opportunity" },
  { id: "competition", label: "Competitive Landscape" },
  { id: "patents", label: "Patents & IP" },
  { id: "publications", label: "Scientific Publications" },
  { id: "applications", label: "Application Areas" },
  { id: "commercialization", label: "Commercialization" },
  { id: "risks", label: "Risks & Considerations" },
  { id: "conclusion", label: "Investment Thesis" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { count, ref };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="section-divider mb-6">
      <span style={{ fontFamily: "'Playfair Display', serif", color: TEAL, fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
        {number} — {title}
      </span>
    </div>
  );
}

function StatCard({ value, suffix, label, sublabel }: { value: number; suffix: string; label: string; sublabel?: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="stat-card text-center">
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 700, color: TEAL, lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontWeight: 600, marginTop: "0.5rem", color: "#1a2e30", fontSize: "0.95rem" }}>{label}</div>
      {sublabel && <div style={{ color: "#6b7c7e", fontSize: "0.8rem", marginTop: "0.25rem" }}>{sublabel}</div>}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function Home() {
  const activeSection = useActiveSection(SECTIONS.map((s) => s.id));
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  return (
    <div style={{ background: "#fafaf8", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── Sticky Nav ── */}
      <nav className="sticky-nav">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL }} />
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: TEAL, fontSize: "1rem" }}>Cellanome</span>
            <span style={{ color: "#9aacae", fontSize: "0.85rem" }}>Investment Research Report</span>
          </div>
          <div style={{ display: "flex", gap: "0.25rem", fontSize: "0.78rem", color: "#6b7c7e" }}>
            <span>March 2026</span>
            <span style={{ margin: "0 0.5rem" }}>·</span>
            <span>Confidential</span>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: "relative", height: "520px", overflow: "hidden" }}>
        <img src={HERO_IMG} alt="Cellanome CellCage technology" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,30,25,0.85) 0%, rgba(10,30,25,0.6) 50%, rgba(10,30,25,0.2) 100%)" }} />
        <div className="container" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ maxWidth: "640px" }}>
            <div style={{ color: "#7ecfd4", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Private Company Investment Analysis
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#ffffff", lineHeight: 1.1, marginBottom: "1.25rem" }}>
              Cellanome, Inc.
            </h1>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "1.15rem", lineHeight: 1.65, marginBottom: "2rem", maxWidth: "520px" }}>
              A foundational platform for live-cell biology — bridging the gap between what cells <em>do</em> and what they <em>express</em>, at unprecedented scale.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {[
                { label: "Founded", value: "2020" },
                { label: "Total Raised", value: "$213M+" },
                { label: "Employees", value: "~105" },
                { label: "HQ", value: "Foster City, CA" },
              ].map((item) => (
                <div key={item.label} style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "0.5rem", padding: "0.6rem 1rem" }}>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{item.label}</div>
                  <div style={{ color: "#ffffff", fontWeight: 600, fontSize: "0.95rem" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Body Layout ── */}
      <div className="container" style={{ display: "grid", gridTemplateColumns: "clamp(180px, 18vw, 220px) 1fr", gap: "2.5rem", paddingTop: "3rem", paddingBottom: "5rem" }}>

        {/* ── Sidebar TOC ── */}
        <aside style={{ display: "block" }}>
          <div style={{ position: "sticky", top: "72px" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#9aacae", marginBottom: "1rem" }}>Contents</div>
            <nav>
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  style={{
                    display: "block",
                    padding: "0.4rem 0.75rem",
                    marginBottom: "0.1rem",
                    fontSize: "0.82rem",
                    borderLeft: `2px solid ${activeSection === s.id ? TEAL : "transparent"}`,
                    color: activeSection === s.id ? TEAL : "#6b7c7e",
                    fontWeight: activeSection === s.id ? 600 : 400,
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    borderRadius: "0 0.25rem 0.25rem 0",
                    background: activeSection === s.id ? TEAL_PALE : "transparent",
                  }}
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ minWidth: 0 }}>

          {/* ── 01 Executive Summary ── */}
          <section id="executive-summary" style={{ marginBottom: "4rem" }}>
            <SectionHeader number="01" title="Executive Summary" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#0a1e1f", marginBottom: "1.25rem", lineHeight: 1.2 }}>
              The Missing Link in Cell Biology
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#2a3e40", marginBottom: "1.25rem" }}>
              Cellanome is a Foster City, California-based life sciences technology company founded in 2020 with a singular mission: to build a foundational platform that connects the <strong>dynamic behavior of living cells</strong> to their underlying <strong>molecular identities</strong> — at the scale and resolution needed to transform drug discovery, cell therapy, and basic research.
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#2a3e40", marginBottom: "1.25rem" }}>
              For decades, biology has faced a fundamental trade-off: you can either <em>watch</em> what a cell does (live imaging), or <em>read</em> what it expresses (sequencing) — but not both, on the same cell. Cellanome's <strong>CellCage™ technology</strong> and the <strong>R3200 platform</strong> eliminate this trade-off by encapsulating individual live cells in semi-permeable hydrogel compartments, enabling longitudinal observation followed by whole-transcriptome sequencing of the exact same cells.
            </p>
            <div className="callout-card" style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontStyle: "italic", color: "#2a3e40", lineHeight: 1.7, margin: 0 }}>
                "Cellanome allows researchers to observe live cells in action, measure their functional responses, and then molecularly dissect their identities — creating a unified, high-dimensional dataset that was previously impossible to generate."
              </p>
              <p style={{ color: "#9aacae", fontSize: "0.82rem", marginTop: "0.5rem", marginBottom: 0 }}>— Premji Invest, May 2025</p>
            </div>

            {/* Key Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
              <StatCard value={213} suffix="M+" label="Total Raised" sublabel="Across 3 rounds" />
              <StatCard value={150} suffix="M" label="Series B (2024)" sublabel="Largest round" />
              <StatCard value={7} suffix="" label="Patents Granted" sublabel="Since 2022" />
              <StatCard value={105} suffix="" label="Employees" sublabel="As of 2025" />
            </div>
          </section>

          {/* ── 02 Technology ── */}
          <section id="technology" style={{ marginBottom: "4rem" }}>
            <SectionHeader number="02" title="Technology" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#0a1e1f", marginBottom: "1.25rem", lineHeight: 1.2 }}>
              The R3200 Platform & CellCage™ Technology
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#2a3e40", marginBottom: "1.5rem" }}>
              The R3200 is Cellanome's flagship automated cell analysis instrument. It integrates fluorescent imaging, AI-powered cell segmentation, and micro-3D printing to build customized CellCage™ enclosures around individual cells or co-cultures — all within a flow cell that is subsequently used for RNA sequencing.
            </p>

            <img src={TECH_IMG} alt="CellCage technology workflow" style={{ width: "100%", borderRadius: "0.75rem", marginBottom: "1.5rem", border: "1px solid #e0ebec" }} />

            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: TEAL, marginBottom: "1rem" }}>How It Works: Three Stages</h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { step: "1", title: "Encapsulation", desc: "Cells are loaded onto a flow cell. The R3200 uses photopolymerization — focused light — to form semi-permeable hydrogel walls (CellCages) around individual cells or co-cultures in real time. Each cage is sub-nanoliter in volume." },
                { step: "2", title: "Live Observation", desc: "The semi-permeable cage allows media, nutrients, drugs, and reagents to flow freely in and out. Cells are imaged over time — tracking division, morphology, secretion, cytotoxicity, and cell-cell interactions." },
                { step: "3", title: "Molecular Profiling", desc: "After functional observation, cells are lysed in situ. RNA is captured by spatial barcodes on the flow cell surface, enabling the transcriptome of each specific cell to be computationally linked back to its cage and imaging history." },
              ].map((item) => (
                <div key={item.step} style={{ background: "#fff", border: "1px solid #e0ebec", borderRadius: "0.75rem", padding: "1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: TEAL, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.75rem" }}>{item.step}</div>
                  <div style={{ fontWeight: 700, color: "#0a1e1f", marginBottom: "0.5rem", fontSize: "0.95rem" }}>{item.title}</div>
                  <p style={{ color: "#4a6264", fontSize: "0.88rem", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: TEAL, marginBottom: "1rem" }}>Key Technical Differentiators</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {[
                { label: "Semi-permeable hydrogel shell", detail: "Retains cells & macromolecules; freely passes media, enzymes, primers" },
                { label: "Photopolymerization", detail: "Light-triggered, spatially precise cage formation around selected cells" },
                { label: "AI cell segmentation", detail: "Automated identification and targeting of individual cells or clusters" },
                { label: "Spatial barcoding", detail: "Each cage position linked to unique DNA barcode for computational tracing" },
                { label: "Multi-step workflows", detail: "Sequential reagent exchange without material loss — enables complex assays" },
                { label: "Cloud analytics platform", detail: "Integrated data analysis linking imaging phenotypes to transcriptomic data" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: "0.75rem", padding: "0.75rem", background: TEAL_PALE, borderRadius: "0.5rem" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, marginTop: "0.4rem", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, color: "#0a1e1f", fontSize: "0.88rem" }}>{item.label}</div>
                    <div style={{ color: "#4a6264", fontSize: "0.82rem", lineHeight: 1.5 }}>{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="callout-card">
              <p style={{ fontWeight: 600, color: "#0a1e1f", marginBottom: "0.25rem", margin: 0 }}>
                Scientific Validation: <em>Science</em>, Vol. 391, Dec 2025
              </p>
              <p style={{ color: "#4a6264", fontSize: "0.9rem", lineHeight: 1.65, marginTop: "0.5rem", marginBottom: 0 }}>
                The underlying capsule technology was independently validated in a landmark paper published in <em>Science</em> (Mazelis et al., Harvard Medical School). The study demonstrated that semi-permeable capsules (CAGEs) enable high-throughput multistep assays combining live-cell culture with genome-wide readouts — increasing the number of colonies analyzed by ~1,000× over previous well-based methods.
              </p>
            </div>
          </section>

          {/* ── 03 Team ── */}
          <section id="team" style={{ marginBottom: "4rem" }}>
            <SectionHeader number="03" title="Team & Leadership" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#0a1e1f", marginBottom: "0.75rem", lineHeight: 1.2 }}>
              The Illumina Alumni Network
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#2a3e40", marginBottom: "2rem" }}>
              Cellanome's leadership team is arguably one of the most experienced groups in the life sciences tools industry. The founding team and key executives are largely alumni of Illumina — the company that defined and dominated the DNA sequencing market for two decades. This is the same team that took sequencing from a $1,000 genome to a $100 genome.
            </p>
            <div style={{ display: "grid", gap: "1rem" }}>
              {teamData.map((member, i) => (
                <div
                  key={member.name}
                  onClick={() => setExpandedTeam(expandedTeam === i ? null : i)}
                  style={{ background: "#fff", border: `1px solid ${expandedTeam === i ? TEAL : "#e0ebec"}`, borderRadius: "0.75rem", padding: "1.25rem 1.5rem", cursor: "pointer", transition: "all 0.2s ease", boxShadow: expandedTeam === i ? `0 4px 16px ${TEAL}22` : "0 1px 4px rgba(0,0,0,0.05)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: "#0a1e1f" }}>{member.name}</div>
                      <div style={{ color: TEAL, fontWeight: 600, fontSize: "0.88rem", marginTop: "0.2rem" }}>{member.role}</div>
                    </div>
                    <div style={{ color: "#9aacae", fontSize: "1.2rem", marginTop: "0.1rem" }}>{expandedTeam === i ? "−" : "+"}</div>
                  </div>
                  {expandedTeam === i && (
                    <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #e0ebec" }}>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9aacae" }}>Prior Role</span>
                        <p style={{ color: "#2a3e40", fontSize: "0.9rem", lineHeight: 1.6, margin: "0.25rem 0 0" }}>{member.prior}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9aacae" }}>Focus at Cellanome</span>
                        <p style={{ color: "#2a3e40", fontSize: "0.9rem", lineHeight: 1.6, margin: "0.25rem 0 0" }}>{member.focus}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.9rem", color: "#6b7c7e", marginTop: "1rem", fontStyle: "italic" }}>Click any card to expand details.</p>
          </section>

          {/* ── 04 Funding ── */}
          <section id="funding" style={{ marginBottom: "4rem" }}>
            <SectionHeader number="04" title="Funding" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#0a1e1f", marginBottom: "1.25rem", lineHeight: 1.2 }}>
              $213M+ Raised from Elite Investors
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#2a3e40", marginBottom: "2rem" }}>
              Cellanome has raised over $213 million across three funding rounds. The $150M Series B in January 2024 — led by Premji Invest and DFJ Growth — was one of the largest private life sciences tools rounds of the year, reflecting strong conviction in the team and technology.
            </p>

            <div style={{ background: "#fff", border: "1px solid #e0ebec", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "2rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#0a1e1f", marginBottom: "1.25rem" }}>Funding by Round ($M)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={fundingData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f4" />
                  <XAxis dataKey="round" tick={{ fontSize: 12, fill: "#6b7c7e" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7c7e" }} unit="M" />
                  <Tooltip
                    formatter={(value: number) => [`$${value}M`, "Amount"]}
                    contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e0ebec", fontSize: "0.85rem" }}
                  />
                  <Bar dataKey="amount" fill={TEAL} radius={[4, 4, 0, 0]}>
                    {fundingData.map((_, index) => (
                      <Cell key={index} fill={index === 1 ? TEAL : index === 2 ? AMBER : TEAL_LIGHT} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { name: "Premji Invest", type: "Lead, Series B", note: "Azim Premji's family office; long-term patient capital" },
                { name: "DFJ Growth", type: "Lead, Series B", note: "Tier-1 growth equity; backed SpaceX, Tesla, Skype" },
                { name: "Wing Venture Capital", type: "Series B", note: "Enterprise tech focus; deep science expertise" },
                { name: "8VC", type: "Early Stage", note: "Joe Lonsdale's firm; life sciences & deep tech" },
                { name: "DCVC", type: "Early Stage", note: "Data Collective; computational biology focus" },
                { name: "SV Angel", type: "Seed", note: "Ron Conway's firm; legendary early-stage investor" },
              ].map((inv) => (
                <div key={inv.name} style={{ background: "#fff", border: "1px solid #e0ebec", borderRadius: "0.75rem", padding: "1rem 1.25rem" }}>
                  <div style={{ fontWeight: 700, color: "#0a1e1f", fontSize: "0.95rem" }}>{inv.name}</div>
                  <div style={{ color: AMBER, fontWeight: 600, fontSize: "0.78rem", marginTop: "0.2rem" }}>{inv.type}</div>
                  <div style={{ color: "#6b7c7e", fontSize: "0.8rem", marginTop: "0.4rem", lineHeight: 1.5 }}>{inv.note}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 05 Market ── */}
          <section id="market" style={{ marginBottom: "4rem" }}>
            <SectionHeader number="05" title="Market Opportunity" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#0a1e1f", marginBottom: "1.25rem", lineHeight: 1.2 }}>
              A Rapidly Expanding Multi-Billion Dollar Market
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#2a3e40", marginBottom: "2rem" }}>
              Cellanome operates at the intersection of two of the fastest-growing segments in life sciences tools: single-cell analysis and multi-omics. The single-cell analysis market was valued at ~$4.3B in 2024, growing at a CAGR of 10–15%. The broader multi-omics market is projected to reach $13.2B by 2035.
            </p>

            <div style={{ background: "#fff", border: "1px solid #e0ebec", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "2rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#0a1e1f", marginBottom: "1.25rem" }}>Market Size Projections ($B)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={marketSizeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f4" />
                  <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#6b7c7e" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7c7e" }} unit="B" />
                  <Tooltip
                    formatter={(value: number, name: string) => [`$${value}B`, name]}
                    contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e0ebec", fontSize: "0.85rem" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "0.85rem" }} />
                  <Line type="monotone" dataKey="singleCell" name="Single-Cell Analysis" stroke={TEAL} strokeWidth={2.5} dot={{ fill: TEAL, r: 4 }} />
                  <Line type="monotone" dataKey="multiOmics" name="Multi-Omics" stroke={AMBER} strokeWidth={2.5} dot={{ fill: AMBER, r: 4 }} strokeDasharray="5 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { label: "Single-Cell Analysis CAGR", value: "10–15%", desc: "2024–2030 projected growth" },
                { label: "Multi-Omics Market (2035)", value: "$13.2B", desc: "Precedence Research, 2025" },
                { label: "Key Drivers", value: "AI + Drug Discovery", desc: "Pharma R&D + cell therapy" },
                { label: "Cellanome's TAM", value: "Broad", desc: "Pharma, biotech, academic, agri" },
              ].map((item) => (
                <div key={item.label} style={{ background: TEAL_PALE, borderRadius: "0.75rem", padding: "1.25rem" }}>
                  <div style={{ color: "#6b7c7e", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: TEAL, marginTop: "0.25rem" }}>{item.value}</div>
                  <div style={{ color: "#4a6264", fontSize: "0.82rem", marginTop: "0.25rem" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 06 Competition ── */}
          <section id="competition" style={{ marginBottom: "4rem" }}>
            <SectionHeader number="06" title="Competitive Landscape" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#0a1e1f", marginBottom: "1.25rem", lineHeight: 1.2 }}>
              A Differentiated Position in a Crowded Space
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#2a3e40", marginBottom: "2rem" }}>
              Cellanome operates in the single-cell analysis and live-cell biology space alongside several well-funded competitors. However, its unique combination of live-cell tracking, transcriptomics, and cell-cell interaction analysis creates a differentiated position that no single competitor currently replicates.
            </p>

            <div style={{ background: "#fff", border: "1px solid #e0ebec", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "2rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#0a1e1f", marginBottom: "1.25rem" }}>Capability Comparison Radar</h3>
              <ResponsiveContainer width="100%" height={360}>
                <RadarChart data={competitorRadarData}>
                  <PolarGrid stroke="#e0ebec" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#4a6264" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "#9aacae" }} />
                  <Radar name="Cellanome" dataKey="Cellanome" stroke={TEAL} fill={TEAL} fillOpacity={0.25} strokeWidth={2} />
                  <Radar name="10x Genomics" dataKey="10x Genomics" stroke={AMBER} fill={AMBER} fillOpacity={0.1} strokeWidth={1.5} />
                  <Radar name="Bruker/Berkeley" dataKey="Bruker/Berkeley" stroke="#9b59b6" fill="#9b59b6" fillOpacity={0.1} strokeWidth={1.5} />
                  <Radar name="Parse Bio" dataKey="Parse Bio" stroke="#e74c3c" fill="#e74c3c" fillOpacity={0.1} strokeWidth={1.5} />
                  <Legend wrapperStyle={{ fontSize: "0.82rem" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: TEAL, color: "#fff" }}>
                    {["Company", "Core Technology", "Live-Cell", "Transcriptomics", "Cell Interaction", "Key Weakness"].map((h) => (
                      <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, fontSize: "0.8rem" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { company: "Cellanome", tech: "CellCage™ hydrogel + sequencing", live: "✓ Full", seq: "✓ Full", interact: "✓ Full", weakness: "Early commercialization stage" },
                    { company: "10x Genomics", tech: "Droplet microfluidics (Chromium, Xenium)", live: "Partial (Xenium)", seq: "✓ Full", interact: "Limited", weakness: "Destructive; no live-cell tracking" },
                    { company: "Bruker/Berkeley Lights", tech: "Optofluidic cell isolation (Beacon)", live: "✓ Full", seq: "Limited", interact: "Partial", weakness: "Low throughput; limited sequencing" },
                    { company: "Parse Biosciences", tech: "Split-pool barcoding (EVERCODE)", live: "✗ None", seq: "✓ Full", interact: "✗ None", weakness: "No live-cell or imaging capability" },
                    { company: "ThinkCyte", tech: "AI label-free sorting (VisionSort)", live: "Partial", seq: "Limited", interact: "✗ None", weakness: "No deep sequencing integration" },
                  ].map((row, i) => (
                    <tr key={row.company} style={{ background: i % 2 === 0 ? "#fff" : "#f8fbfb", borderBottom: "1px solid #e0ebec" }}>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: row.company === "Cellanome" ? 700 : 400, color: row.company === "Cellanome" ? TEAL : "#0a1e1f" }}>{row.company}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#4a6264" }}>{row.tech}</td>
                      <td style={{ padding: "0.75rem 1rem", color: row.live.startsWith("✓") ? "#16a34a" : row.live.startsWith("✗") ? "#dc2626" : "#ca8a04" }}>{row.live}</td>
                      <td style={{ padding: "0.75rem 1rem", color: row.seq.startsWith("✓") ? "#16a34a" : row.seq.startsWith("✗") ? "#dc2626" : "#ca8a04" }}>{row.seq}</td>
                      <td style={{ padding: "0.75rem 1rem", color: row.interact.startsWith("✓") ? "#16a34a" : row.interact.startsWith("✗") ? "#dc2626" : "#ca8a04" }}>{row.interact}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#6b7c7e", fontSize: "0.82rem" }}>{row.weakness}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── 07 Patents ── */}
          <section id="patents" style={{ marginBottom: "4rem" }}>
            <SectionHeader number="07" title="Patents & IP" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#0a1e1f", marginBottom: "1.25rem", lineHeight: 1.2 }}>
              A Growing Patent Portfolio
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#2a3e40", marginBottom: "2rem" }}>
              Cellanome has been aggressively building its intellectual property portfolio since its founding. The company has been granted 7 US patents and has filed multiple PCT applications, with key inventors including Tarun Kumar Khurana, Ali Agah, Yir-Shyuan Wu, and Filiz Gorpe Yasar. The patents cover the core photopolymerization process, cell encapsulation methods, imaging-sequencing integration, and cell interaction detection.
            </p>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              {patentTimeline.map((p) => (
                <div key={p.patent} className="timeline-item" style={{ paddingBottom: "1rem" }}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                    <div style={{ minWidth: "90px" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: AMBER }}>{p.year}</div>
                      <div style={{ fontSize: "0.78rem", color: "#9aacae", fontFamily: "monospace" }}>{p.patent}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: "#0a1e1f", fontSize: "0.9rem", lineHeight: 1.4 }}>{p.title}</div>
                      <span style={{ display: "inline-block", marginTop: "0.3rem", padding: "0.15rem 0.6rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 600, background: p.type === "Grant" ? "#dcfce7" : "#fef3c7", color: p.type === "Grant" ? "#16a34a" : "#92400e" }}>{p.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 08 Publications ── */}
          <section id="publications" style={{ marginBottom: "4rem" }}>
            <SectionHeader number="08" title="Scientific Publications" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#0a1e1f", marginBottom: "1.25rem", lineHeight: 1.2 }}>
              Peer-Reviewed Validation
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#2a3e40", marginBottom: "2rem" }}>
              Cellanome's technology has been independently validated in top-tier scientific journals and presented at major conferences including AGBT, AACR, and JITC. The publication in <em>Science</em> in December 2025 is particularly significant, as it represents independent academic validation of the core capsule technology.
            </p>

            <div style={{ display: "grid", gap: "1rem" }}>
              {[
                {
                  title: "Multi-step genomics on single cells and live cultures in sub-nanoliter capsules",
                  journal: "Science", volume: "Vol. 391, Issue 6790", date: "December 2025",
                  authors: "Mazelis et al., Harvard Medical School",
                  impact: "Landmark independent validation of semi-permeable capsule technology. ~1,000× more colonies analyzed than well-based methods.",
                  badge: "Science",
                },
                {
                  title: "High-throughput single-cell omics using semipermeable capsules",
                  journal: "Science", volume: "Vol. 391", date: "March 2026",
                  authors: "Baronas et al.",
                  impact: "Co-submitted companion paper demonstrating scRNA-seq of acute myeloid leukemia patient samples, uncovering distinct leukemic cell phenotypes.",
                  badge: "Science",
                },
                {
                  title: "Establishing a multi-modal, cell therapy characterization workflow to identify cell subsets with heightened cytotoxicity",
                  journal: "Cancer Research (AACR)", volume: "Vol. 85, Supplement", date: "April 2025",
                  authors: "Houston Methodist Research Institute",
                  impact: "Demonstrated Cellanome's ability to identify cytotoxic T-cells (~85% accuracy) comparable to flow cytometry, while also capturing molecular identity.",
                  badge: "AACR",
                },
                {
                  title: "Leveraging a novel, multi-modal platform to identify drug resistant clones with distinct mechanisms of resistance to EGFR inhibitors",
                  journal: "JITC", volume: "Supplement 2", date: "2025",
                  authors: "Li et al.",
                  impact: "Used the R3200 platform to identify drug-resistant cancer cell clones and their molecular mechanisms of resistance — a key pharmaceutical use case.",
                  badge: "JITC",
                },
                {
                  title: "Unveiling genes in dendritic cells that enhance T cell priming through functional multiplexed single cell-cell interaction analysis",
                  journal: "JITC", volume: "Supplement 2", date: "2025",
                  authors: "Valente et al.",
                  impact: "Demonstrated CellCage enclosures for co-culture of dendritic cells and T-cells to study immune cell interactions at single-cell resolution.",
                  badge: "JITC",
                },
              ].map((pub) => (
                <div key={pub.title} style={{ background: "#fff", border: "1px solid #e0ebec", borderRadius: "0.75rem", padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <span style={{ flexShrink: 0, padding: "0.2rem 0.6rem", borderRadius: "0.25rem", fontSize: "0.72rem", fontWeight: 700, background: pub.badge === "Science" ? "#0d5c63" : pub.badge === "AACR" ? "#7c3aed" : "#0369a1", color: "#fff" }}>{pub.badge}</span>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#0a1e1f", fontSize: "0.95rem", lineHeight: 1.4 }}>{pub.title}</div>
                  </div>
                  <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                    <span style={{ color: "#6b7c7e", fontSize: "0.82rem" }}><strong>Journal:</strong> {pub.journal} — {pub.volume}</span>
                    <span style={{ color: "#6b7c7e", fontSize: "0.82rem" }}><strong>Date:</strong> {pub.date}</span>
                    <span style={{ color: "#6b7c7e", fontSize: "0.82rem" }}><strong>Authors:</strong> {pub.authors}</span>
                  </div>
                  <div className="callout-card" style={{ marginTop: "0.5rem" }}>
                    <p style={{ color: "#2a3e40", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}><strong>Key Finding:</strong> {pub.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 09 Applications ── */}
          <section id="applications" style={{ marginBottom: "4rem" }}>
            <SectionHeader number="09" title="Application Areas" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#0a1e1f", marginBottom: "1.25rem", lineHeight: 1.2 }}>
              Broad Applicability Across Biology
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#2a3e40", marginBottom: "2rem" }}>
              The R3200 platform is designed as a horizontal tool — applicable across multiple research domains wherever understanding the link between cellular behavior and molecular identity is valuable.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
              {applicationAreas.map((app) => (
                <div key={app.area} style={{ background: "#fff", border: "1px solid #e0ebec", borderRadius: "0.75rem", padding: "1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "0.5rem", background: TEAL_PALE, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: TEAL }} />
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#0a1e1f", fontSize: "1rem", marginBottom: "0.5rem" }}>{app.area}</div>
                  <p style={{ color: "#4a6264", fontSize: "0.88rem", lineHeight: 1.65, margin: 0 }}>{app.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── 10 Commercialization ── */}
          <section id="commercialization" style={{ marginBottom: "4rem" }}>
            <SectionHeader number="10" title="Commercialization" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#0a1e1f", marginBottom: "1.25rem", lineHeight: 1.2 }}>
              From Stealth to Commercial Launch
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#2a3e40", marginBottom: "2rem" }}>
              After operating in stealth mode for four years, Cellanome began publicly showcasing its platform at scientific conferences in late 2024 and 2025. The company is now in active commercialization, with R3200 instruments installed at customer sites in the US and Europe.
            </p>

            <div style={{ display: "grid", gap: "0.75rem", marginBottom: "2rem" }}>
              {[
                { date: "2020", event: "Company founded by Mostafa Ronaghi and team; operating in stealth" },
                { date: "Jan 2024", event: "$150M Series B raised; company begins limited public disclosure" },
                { date: "Jan 2025", event: "Mostafa Ronaghi appears on Timmerman Report podcast; first public interview" },
                { date: "Dec 2025", event: "CEO Omead Ostadan debuts on Mendelspod podcast; R3200 platform officially launched" },
                { date: "Dec 2025", event: "Landmark Science paper validates capsule technology (Harvard Medical School)" },
                { date: "Jan 2026", event: "Matthew Spitzer and Pier Federico Gherardini discuss using CellCage for immune cell research (Mendelspod)" },
                { date: "Mar 2026", event: "First European R3200 installation at VIB Technologies, Ghent, Belgium" },
                { date: "Mar 2026", event: "Cellanome showcases platform at AGBT 2026; multiple posters and presentations" },
                { date: "Apr 2026", event: "AACR Annual Meeting — Poster #4287 in Immunology: CAR T Cell Functional Enhancement Session" },
              ].map((item) => (
                <div key={item.date} className="timeline-item" style={{ paddingBottom: "0.75rem" }}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div style={{ minWidth: "80px", fontSize: "0.78rem", fontWeight: 700, color: AMBER }}>{item.date}</div>
                    <div style={{ color: "#2a3e40", fontSize: "0.9rem", lineHeight: 1.5 }}>{item.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 11 Risks ── */}
          <section id="risks" style={{ marginBottom: "4rem" }}>
            <SectionHeader number="11" title="Risks & Considerations" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#0a1e1f", marginBottom: "1.25rem", lineHeight: 1.2 }}>
              Key Risk Factors
            </h2>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {[
                { risk: "Early Commercialization Risk", detail: "The R3200 is newly launched. Customer adoption, instrument reliability, and reagent consumable revenue are unproven at scale. Workflow integration into existing lab pipelines may be slower than expected.", level: "High" },
                { risk: "Competition from 10x Genomics", detail: "10x Genomics has dominant market share, a large installed base, and is actively developing live-cell imaging integrations (Xenium). They have significant resources to compete.", level: "Medium" },
                { risk: "Technology Complexity", detail: "The CellCage workflow is more complex than droplet-based methods. Researcher adoption requires training and workflow changes. Simplicity is a key selling point of competitors.", level: "Medium" },
                { risk: "Funding Runway", detail: "With $213M raised and ~105 employees, the company needs continued capital to scale manufacturing, sales, and support. Series C terms and timeline are unclear.", level: "Medium" },
                { risk: "Regulatory / Reimbursement (Clinical)", detail: "If Cellanome pursues clinical diagnostics applications, FDA regulatory pathways add significant time and cost. Current focus is research-use-only (RUO).", level: "Low" },
                { risk: "Key Person Risk", detail: "The company's credibility is closely tied to Mostafa Ronaghi and Jay Flatley. Their continued involvement is important for investor and customer confidence.", level: "Low" },
              ].map((item) => (
                <div key={item.risk} style={{ background: "#fff", border: `1px solid ${item.level === "High" ? "#fca5a5" : item.level === "Medium" ? "#fcd34d" : "#86efac"}`, borderRadius: "0.75rem", padding: "1rem 1.25rem", display: "flex", gap: "1rem" }}>
                  <span style={{ flexShrink: 0, padding: "0.2rem 0.6rem", borderRadius: "0.25rem", fontSize: "0.72rem", fontWeight: 700, height: "fit-content", background: item.level === "High" ? "#fee2e2" : item.level === "Medium" ? "#fef9c3" : "#dcfce7", color: item.level === "High" ? "#dc2626" : item.level === "Medium" ? "#92400e" : "#16a34a" }}>{item.level}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: "#0a1e1f", fontSize: "0.92rem", marginBottom: "0.3rem" }}>{item.risk}</div>
                    <p style={{ color: "#4a6264", fontSize: "0.87rem", lineHeight: 1.6, margin: 0 }}>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 12 Conclusion ── */}
          <section id="conclusion" style={{ marginBottom: "2rem" }}>
            <SectionHeader number="12" title="Investment Thesis" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#0a1e1f", marginBottom: "1.25rem", lineHeight: 1.2 }}>
              Why Cellanome Could Be the Next Illumina
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#2a3e40", marginBottom: "1.25rem" }}>
              The bull case for Cellanome rests on a simple but powerful analogy: just as Illumina's sequencing platform became the indispensable tool for genomics research, Cellanome's R3200 has the potential to become the indispensable tool for the next generation of cell biology research — one that is increasingly focused on understanding cellular dynamics, not just static snapshots.
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#2a3e40", marginBottom: "1.5rem" }}>
              The convergence of AI-driven drug discovery, cell therapy development, and functional genomics creates a massive and growing demand for exactly the kind of data that Cellanome generates. The company has the right team (Illumina veterans), the right technology (independently validated in <em>Science</em>), the right IP (7 granted patents), and the right investors (Premji, DFJ, Wing) to execute on this vision.
            </p>

            <div style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #1a8a96 100%)`, borderRadius: "1rem", padding: "2rem", color: "#fff", marginBottom: "2rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.25rem" }}>Investment Thesis Summary</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
                {[
                  { label: "Team", score: "★★★★★", note: "Best-in-class genomics veterans" },
                  { label: "Technology", score: "★★★★★", note: "Validated in Science; 7 patents" },
                  { label: "Market", score: "★★★★★", note: "$10B+ TAM by 2030" },
                  { label: "Differentiation", score: "★★★★☆", note: "Unique; no direct competitor" },
                  { label: "Commercialization", score: "★★★☆☆", note: "Early stage; unproven at scale" },
                  { label: "Risk/Reward", score: "★★★★☆", note: "High potential, manageable risks" },
                ].map((item) => (
                  <div key={item.label} style={{ background: "rgba(255,255,255,0.12)", borderRadius: "0.75rem", padding: "1rem" }}>
                    <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)", marginBottom: "0.3rem" }}>{item.label}</div>
                    <div style={{ fontSize: "1rem", color: AMBER, marginBottom: "0.3rem" }}>{item.score}</div>
                    <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.85)" }}>{item.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="callout-card">
              <p style={{ fontWeight: 700, color: "#0a1e1f", marginBottom: "0.5rem", fontSize: "1rem" }}>Bottom Line</p>
              <p style={{ color: "#2a3e40", lineHeight: 1.75, margin: 0 }}>
                Cellanome represents a compelling investment opportunity in a company that is building foundational infrastructure for the next era of biology. The risks are real — commercialization is early, competition is fierce, and the technology is complex. But the team has done this before, the science is validated, and the market is enormous. For an investor with a 5–10 year horizon and appetite for life sciences tools, Cellanome deserves serious consideration.
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer style={{ borderTop: "1px solid #e0ebec", paddingTop: "2rem", marginTop: "2rem", color: "#9aacae", fontSize: "0.8rem", lineHeight: 1.7 }}>
            <p><strong>Disclaimer:</strong> This report is prepared for informational purposes only and does not constitute investment advice. All data is sourced from publicly available information including company websites, press releases, patent databases, scientific publications, and investor communications as of March 2026. Financial projections are estimates based on third-party market research.</p>
            <p style={{ marginTop: "0.75rem" }}>Sources: Cellanome.com · Justia Patents · Science (DOI: 10.1126/science.ady7209) · Premji Invest Blog · DFJ Growth Blog · Timmerman Report · Mendelspod · GenomeWeb · AACR Cancer Research · JITC · Grand View Research · Precedence Research</p>
            <p style={{ marginTop: "0.75rem" }}>Report generated by Manus AI · March 26, 2026</p>
          </footer>
        </main>
      </div>
      
      {/* AI Chat Widget */}
      <ChatWidget currentSection={activeSection} />
    </div>
  );
}
