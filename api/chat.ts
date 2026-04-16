// Vercel Serverless Function for Cellanome Chat
// Queries Supabase knowledge base and uses AI to generate responses

interface VercelRequest {
  method: string;
  body: any;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
}

const SUPABASE_URL = 'https://pszdgleiigwpobuxckra.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzemRnbGVpaWd3cG9idXhja3JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjE5NTMsImV4cCI6MjA2MDM5Nzk1M30.RPNtCOIAwsLa9BsPMHNyIlCvbdlbmnOS0M6lMKSAlJ0';

// Fetch from Supabase
async function supabaseQuery(table: string, query?: string) {
  const url = query 
    ? `${SUPABASE_URL}/rest/v1/${table}?${query}`
    : `${SUPABASE_URL}/rest/v1/${table}`;
  
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  return res.json();
}

// Search chunks by keywords
async function searchKnowledge(keywords: string[]): Promise<any[]> {
  // Get all chunks and filter by keywords (simple text search)
  const chunks = await supabaseQuery('kb_chunks', 'select=*');
  
  if (!Array.isArray(chunks)) return [];
  
  // Score chunks by keyword matches
  const scored = chunks.map((chunk: any) => {
    const content = (chunk.content || '').toLowerCase();
    const score = keywords.reduce((acc, kw) => {
      return acc + (content.includes(kw.toLowerCase()) ? 1 : 0);
    }, 0);
    return { ...chunk, score };
  });
  
  // Return top matches
  return scored
    .filter((c: any) => c.score > 0)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 5);
}

// Get company info
async function getCompanyInfo(): Promise<any> {
  const data = await supabaseQuery('kb_company', 'select=*&id=eq.1');
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

// Get section by ID or keyword
async function getSection(keyword: string): Promise<any> {
  const sections = await supabaseQuery('kb_sections', 'select=*');
  
  if (!Array.isArray(sections)) return null;
  
  // Find best matching section
  const kw = keyword.toLowerCase();
  return sections.find((s: any) => 
    s.id.includes(kw) || 
    (s.title || '').toLowerCase().includes(kw) ||
    (s.subtitle || '').toLowerCase().includes(kw)
  );
}

// Extract keywords from message
function extractKeywords(message: string): string[] {
  const stopWords = new Set(['what', 'is', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'how', 'much', 'many', 'who', 'are', 'their', 'they', 'has', 'have', 'does', 'do', 'can', 'could', 'would', 'should', 'tell', 'me']);
  
  return message
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
}

// Generate response based on context
async function generateResponse(message: string): Promise<string> {
  const keywords = extractKeywords(message);
  const lowerMessage = message.toLowerCase();
  
  // Get company info for basic questions
  const company = await getCompanyInfo();
  
  // Check for specific topics
  if (lowerMessage.includes('fund') || lowerMessage.includes('raise') || lowerMessage.includes('invest') || lowerMessage.includes('money')) {
    const chunks = await searchKnowledge(['funding', 'series', 'raised', 'investor', 'premji', 'dfj']);
    const section = await getSection('funding');
    
    if (chunks.length > 0 || section) {
      const investors = chunks.filter((c: any) => c.chunk_type === 'investor').map((c: any) => c.metadata?.name).filter(Boolean);
      const rounds = chunks.filter((c: any) => c.chunk_type === 'funding_round').map((c: any) => c.content).filter(Boolean);
      
      let response = `Cellanome has raised ${company?.total_raised || '$213M+'} in total funding.`;
      
      if (rounds.length > 0) {
        response += `\n\nFunding rounds:\n• ${rounds.join('\n• ')}`;
      }
      
      if (investors.length > 0) {
        response += `\n\nKey investors include: ${investors.join(', ')}.`;
      }
      
      return response;
    }
  }
  
  if (lowerMessage.includes('team') || lowerMessage.includes('founder') || lowerMessage.includes('ceo') || lowerMessage.includes('leadership')) {
    const chunks = await searchKnowledge(['team', 'ceo', 'founder', 'board', 'illumina']);
    
    if (chunks.length > 0) {
      const teamMembers = chunks.filter((c: any) => c.chunk_type === 'team').map((c: any) => {
        const m = c.metadata;
        return m ? `**${m.name}** (${m.role}): Previously ${m.prior_role}` : c.content;
      });
      
      return `Cellanome's leadership team consists of Illumina alumni with deep experience in life sciences tools:\n\n${teamMembers.join('\n\n')}`;
    }
  }
  
  if (lowerMessage.includes('technolog') || lowerMessage.includes('platform') || lowerMessage.includes('cellcage') || lowerMessage.includes('r3200') || lowerMessage.includes('how') && lowerMessage.includes('work')) {
    const section = await getSection('technology');
    const chunks = await searchKnowledge(['cellcage', 'encapsulation', 'photopolymerization', 'sequencing', 'hydrogel']);
    
    let response = section?.content || "Cellanome's R3200 platform combines live-cell imaging with single-cell sequencing.";
    
    const howItWorks = chunks.filter((c: any) => c.chunk_type === 'how_it_works');
    if (howItWorks.length > 0) {
      response += '\n\n**How it works:**\n';
      howItWorks.forEach((c: any) => {
        response += `• ${c.content}\n`;
      });
    }
    
    return response;
  }
  
  if (lowerMessage.includes('market') || lowerMessage.includes('size') || lowerMessage.includes('opportunity') || lowerMessage.includes('tam')) {
    const section = await getSection('market');
    const chunks = await searchKnowledge(['market', 'billion', 'cagr', 'growth']);
    
    return section?.content || "The single-cell analysis market is projected to reach $10.8B by 2030, with multi-omics reaching $13.2B. Cellanome operates at this intersection with a CAGR of 10-15%.";
  }
  
  if (lowerMessage.includes('compet') || lowerMessage.includes('10x') || lowerMessage.includes('versus') || lowerMessage.includes('vs')) {
    const chunks = await searchKnowledge(['competitor', '10x', 'parse', 'bruker', 'berkeley']);
    
    if (chunks.length > 0) {
      const competitors = chunks.filter((c: any) => c.chunk_type === 'competitor').map((c: any) => {
        const m = c.metadata;
        return m ? `**${m.company}**: ${m.technology}. Weakness: ${m.weakness}` : c.content;
      });
      
      return `Cellanome competes in the single-cell analysis space with a unique combination of live-cell tracking + transcriptomics that no competitor fully replicates:\n\n${competitors.join('\n\n')}`;
    }
  }
  
  if (lowerMessage.includes('patent') || lowerMessage.includes('ip') || lowerMessage.includes('intellectual')) {
    const chunks = await searchKnowledge(['patent', 'granted', 'pct']);
    
    if (chunks.length > 0) {
      const patents = chunks.filter((c: any) => c.chunk_type === 'patent').map((c: any) => `• ${c.content}`);
      return `Cellanome has 7 granted US patents and multiple PCT filings:\n\n${patents.join('\n')}`;
    }
  }
  
  if (lowerMessage.includes('risk') || lowerMessage.includes('concern') || lowerMessage.includes('challenge')) {
    const chunks = await searchKnowledge(['risk', 'challenge', 'competition', 'early']);
    
    if (chunks.length > 0) {
      const risks = chunks.filter((c: any) => c.chunk_type === 'risk').map((c: any) => {
        const m = c.metadata;
        return m ? `**${m.level} Risk - ${m.risk}**: ${m.description}` : c.content;
      });
      
      return `Key risk factors for Cellanome:\n\n${risks.join('\n\n')}`;
    }
  }
  
  if (lowerMessage.includes('publication') || lowerMessage.includes('science') || lowerMessage.includes('paper') || lowerMessage.includes('research')) {
    const chunks = await searchKnowledge(['publication', 'science', 'journal', 'paper']);
    
    if (chunks.length > 0) {
      const pubs = chunks.filter((c: any) => c.chunk_type === 'publication').map((c: any) => `• ${c.content}`);
      return `Cellanome's technology has been validated in peer-reviewed publications:\n\n${pubs.join('\n\n')}`;
    }
  }
  
  // General search fallback
  const relevantChunks = await searchKnowledge(keywords);
  
  if (relevantChunks.length > 0) {
    const context = relevantChunks.slice(0, 3).map((c: any) => c.content).join('\n\n');
    return `Based on the Cellanome research report:\n\n${context}`;
  }
  
  // Default response with company overview
  if (company) {
    return `${company.name} is ${company.one_liner}\n\n**Key Facts:**\n• Founded: ${company.founded}\n• Headquarters: ${company.headquarters}\n• Total Raised: ${company.total_raised}\n• Employees: ${company.employees}\n\nI can help you explore their technology, team, funding, market opportunity, competitive landscape, patents, or investment thesis. What would you like to know more about?`;
  }
  
  return "I can help you understand Cellanome's technology, team, funding, market opportunity, competitive landscape, and investment thesis. What would you like to know?";
}

// Log chat message to Supabase
async function logMessage(sessionId: string, role: string, content: string) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/chat_messages`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ session_id: sessionId, role, content })
    });
  } catch (e) {
    console.error('Failed to log message:', e);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Log user message
    const sid = sessionId || `anon-${Date.now()}`;
    await logMessage(sid, 'user', message);

    // Generate response from knowledge base
    const response = await generateResponse(message);
    
    // Log assistant response
    await logMessage(sid, 'assistant', response);
    
    res.json({ response, sessionId: sid });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
