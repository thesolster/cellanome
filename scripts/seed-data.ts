// Run with: npx tsx scripts/seed-data.ts
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = 'https://pszdgleiigwpobuxckra.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzemRnbGVpaWd3cG9idXhja3JhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjE5MzMzNywiZXhwIjoyMDkxNzY5MzM3fQ.RPNtCOlAwsLa9BsPMHNyllCvbdlbmnOS0M6IMKSAlJ0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface KnowledgeBase {
  company: {
    name: string;
    founded: string;
    headquarters: string;
    industry: string;
    status: string;
    employees: string;
    total_raised: string;
    mission: string;
    one_liner: string;
  };
  sections: Array<{
    id: string;
    title: string;
    subtitle?: string;
    content?: string;
    key_quote?: { text: string; source: string };
    key_stats?: Record<string, any>;
    how_it_works?: Array<{ stage: number; title: string; description: string }>;
    key_differentiators?: Array<{ feature: string; description: string }>;
    scientific_validation?: string;
    leadership?: Array<{ name: string; role: string; prior_role: string; focus: string }>;
    rounds?: Array<{ round: string; year: string; amount: string; investors?: string[]; status?: string }>;
    investors?: Array<{ name: string; type: string; description: string }>;
    market_size?: Array<{ year: string; single_cell: string; multi_omics: string }>;
    metrics?: Record<string, any>;
    competitors?: Array<{ company: string; technology: string; live_cell: string; transcriptomics: string; cell_interaction: string; weakness: string }>;
    capability_scores?: Record<string, Record<string, number>>;
    patents?: Array<{ year: string; number: string; title: string; type: string }>;
    coverage_areas?: string[];
    publications?: Array<{ title: string; journal: string; volume?: string; date: string; authors: string; key_finding: string }>;
    areas?: Array<{ area: string; description: string }>;
    timeline?: Array<{ date: string; event: string }>;
    risks?: Array<{ risk: string; level: string; description: string }>;
    ratings?: Record<string, { score: number; notes: string }>;
    bottom_line?: string;
  }>;
  sources: string[];
  metadata: {
    report_date: string;
    generated_by: string;
    disclaimer: string;
  };
}

async function seedData() {
  console.log('Loading knowledge base...');
  const kbPath = path.join(process.cwd(), 'knowledge_base.json');
  const kb: KnowledgeBase = JSON.parse(fs.readFileSync(kbPath, 'utf-8'));

  // Insert company info
  console.log('Inserting company info...');
  const { error: companyError } = await supabase
    .from('kb_company')
    .upsert({
      id: 1,
      name: kb.company.name,
      founded: kb.company.founded,
      headquarters: kb.company.headquarters,
      industry: kb.company.industry,
      status: kb.company.status,
      employees: kb.company.employees,
      total_raised: kb.company.total_raised,
      mission: kb.company.mission,
      one_liner: kb.company.one_liner,
      metadata: kb.metadata
    });

  if (companyError) {
    console.error('Company error:', companyError);
  } else {
    console.log('✓ Company info inserted');
  }

  // Insert sections
  console.log('Inserting sections...');
  for (let i = 0; i < kb.sections.length; i++) {
    const section = kb.sections[i];
    
    const { error: sectionError } = await supabase
      .from('kb_sections')
      .upsert({
        id: section.id,
        title: section.title,
        subtitle: section.subtitle || null,
        content: section.content || null,
        section_order: i + 1
      });

    if (sectionError) {
      console.error(`Section ${section.id} error:`, sectionError);
    } else {
      console.log(`✓ Section: ${section.title}`);
    }

    // Insert chunks based on section content
    const chunks: Array<{ section_id: string; chunk_type: string; content: string; metadata: any }> = [];

    // Key quote
    if (section.key_quote) {
      chunks.push({
        section_id: section.id,
        chunk_type: 'quote',
        content: section.key_quote.text,
        metadata: { source: section.key_quote.source }
      });
    }

    // Key stats
    if (section.key_stats) {
      chunks.push({
        section_id: section.id,
        chunk_type: 'stats',
        content: JSON.stringify(section.key_stats),
        metadata: section.key_stats
      });
    }

    // How it works
    if (section.how_it_works) {
      for (const step of section.how_it_works) {
        chunks.push({
          section_id: section.id,
          chunk_type: 'how_it_works',
          content: `Stage ${step.stage}: ${step.title} - ${step.description}`,
          metadata: step
        });
      }
    }

    // Key differentiators
    if (section.key_differentiators) {
      for (const diff of section.key_differentiators) {
        chunks.push({
          section_id: section.id,
          chunk_type: 'differentiator',
          content: `${diff.feature}: ${diff.description}`,
          metadata: diff
        });
      }
    }

    // Scientific validation
    if (section.scientific_validation) {
      chunks.push({
        section_id: section.id,
        chunk_type: 'validation',
        content: section.scientific_validation,
        metadata: {}
      });
    }

    // Leadership/team
    if (section.leadership) {
      for (const person of section.leadership) {
        chunks.push({
          section_id: section.id,
          chunk_type: 'team',
          content: `${person.name} - ${person.role}: ${person.prior_role}. Focus: ${person.focus}`,
          metadata: person
        });
      }
    }

    // Funding rounds
    if (section.rounds) {
      for (const round of section.rounds) {
        chunks.push({
          section_id: section.id,
          chunk_type: 'funding_round',
          content: `${round.round} (${round.year}): ${round.amount}`,
          metadata: round
        });
      }
    }

    // Investors
    if (section.investors) {
      for (const investor of section.investors) {
        chunks.push({
          section_id: section.id,
          chunk_type: 'investor',
          content: `${investor.name} (${investor.type}): ${investor.description}`,
          metadata: investor
        });
      }
    }

    // Market metrics
    if (section.metrics) {
      chunks.push({
        section_id: section.id,
        chunk_type: 'market_metrics',
        content: JSON.stringify(section.metrics),
        metadata: section.metrics
      });
    }

    // Competitors
    if (section.competitors) {
      for (const comp of section.competitors) {
        chunks.push({
          section_id: section.id,
          chunk_type: 'competitor',
          content: `${comp.company}: ${comp.technology}. Live-cell: ${comp.live_cell}, Transcriptomics: ${comp.transcriptomics}, Cell Interaction: ${comp.cell_interaction}. Weakness: ${comp.weakness}`,
          metadata: comp
        });
      }
    }

    // Patents
    if (section.patents) {
      for (const patent of section.patents) {
        chunks.push({
          section_id: section.id,
          chunk_type: 'patent',
          content: `${patent.number} (${patent.year}): ${patent.title} [${patent.type}]`,
          metadata: patent
        });
      }
    }

    // Publications
    if (section.publications) {
      for (const pub of section.publications) {
        chunks.push({
          section_id: section.id,
          chunk_type: 'publication',
          content: `${pub.title} - ${pub.journal} (${pub.date}). Authors: ${pub.authors}. Key finding: ${pub.key_finding}`,
          metadata: pub
        });
      }
    }

    // Application areas
    if (section.areas) {
      for (const area of section.areas) {
        chunks.push({
          section_id: section.id,
          chunk_type: 'application',
          content: `${area.area}: ${area.description}`,
          metadata: area
        });
      }
    }

    // Timeline
    if (section.timeline) {
      for (const event of section.timeline) {
        chunks.push({
          section_id: section.id,
          chunk_type: 'timeline',
          content: `${event.date}: ${event.event}`,
          metadata: event
        });
      }
    }

    // Risks
    if (section.risks) {
      for (const risk of section.risks) {
        chunks.push({
          section_id: section.id,
          chunk_type: 'risk',
          content: `[${risk.level}] ${risk.risk}: ${risk.description}`,
          metadata: risk
        });
      }
    }

    // Investment ratings
    if (section.ratings) {
      chunks.push({
        section_id: section.id,
        chunk_type: 'ratings',
        content: Object.entries(section.ratings).map(([k, v]) => `${k}: ${v.score}/5 - ${v.notes}`).join('; '),
        metadata: section.ratings
      });
    }

    // Bottom line
    if (section.bottom_line) {
      chunks.push({
        section_id: section.id,
        chunk_type: 'bottom_line',
        content: section.bottom_line,
        metadata: {}
      });
    }

    // Insert all chunks for this section
    if (chunks.length > 0) {
      const { error: chunksError } = await supabase
        .from('kb_chunks')
        .insert(chunks);

      if (chunksError) {
        console.error(`  Chunks error for ${section.id}:`, chunksError);
      } else {
        console.log(`  → ${chunks.length} chunks inserted`);
      }
    }
  }

  console.log('\n✅ Knowledge base seeded successfully!');
}

seedData().catch(console.error);
