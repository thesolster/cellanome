import type { VercelRequest, VercelResponse } from '@vercel/node';

const EXPECTED_SECRET = 'cellanome-stress-2026';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Knowledge base facts we can verify against
const VERIFIED_FACTS = {
  founded: '2020',
  total_raised: '$213M+',
  employees: '~105',
  hq: 'Foster City, CA',
  commercial_launch: 'December 2025',
  first_european: 'March 2026, VIB Technologies, Ghent',
  instrument: 'R3200',
  chairman: 'Jay Flatley',
  founder: 'Mostafa Ronaghi',
  ceo: 'Omead Ostadan',
  cso: 'Gary Schroth',
  series_a: '$63M (2020-22)',
  series_b: '$150M (Jan 2024)',
  series_c: '~$90M (in progress)',
  science_paper: 'Baronas et al., Science Vol. 391 (March 2026)',
  patents: '7 US patents granted',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Verify secret
  const secret = req.query.secret as string;
  if (secret !== EXPECTED_SECRET) {
    return res.status(403).json({ error: 'Invalid secret' });
  }
  
  const { content } = req.body;
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Missing content' });
  }
  
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Anthropic API key not configured' });
  }
  
  try {
    // Use Claude to analyze the briefing
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: `You are a fact-checker reviewing an AI-generated investment briefing about Cellanome. Compare it against our verified facts and find any issues.

VERIFIED FACTS:
${JSON.stringify(VERIFIED_FACTS, null, 2)}

BRIEFING TO CHECK:
${content}

Find issues such as:
- Factual errors (wrong numbers, dates, names)
- Hallucinated claims not supported by our knowledge base
- Missing critical context that changes meaning
- Outdated information
- Overstated or understated claims

Return a JSON array of findings. Each finding should have:
- severity: "high", "medium", or "low"
- quote: the exact problematic text from the briefing
- problem: what's wrong with it
- suggested_fix: how to fix the knowledge base to prevent this issue

Return ONLY valid JSON array. If no issues found, return empty array [].

Example format:
[
  {
    "severity": "high",
    "quote": "founded in 2019",
    "problem": "Wrong founding year - company was founded in 2020, not 2019",
    "suggested_fix": "Add explicit founding year clarification: 'Cellanome was founded in 2020 by Mostafa Ronaghi.'"
  }
]`
        }]
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      return res.status(500).json({ error: 'Analysis failed' });
    }
    
    const data = await response.json();
    const text = data.content?.[0]?.text || '[]';
    
    // Parse JSON from response
    let findings = [];
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        findings = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse findings:', e);
      findings = [];
    }
    
    return res.status(200).json({ findings });
    
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ error: 'Analysis failed' });
  }
}
