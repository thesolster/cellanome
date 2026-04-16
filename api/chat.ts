import { VercelRequest, VercelResponse } from '@vercel/node';

// Knowledge base about Cellanome
const knowledgeBase = {
  company: {
    name: "Cellanome",
    description: "Live-cell analysis platform for single-cell genomics",
    founded: "2020",
    employees: "25-50",
    headquarters: "San Francisco Bay Area"
  },
  funding: {
    total: "$213M+",
    rounds: [
      { type: "Seed/Series A", year: "2020-22", amount: "$63M", investors: "8VC, DCVC, SV Angel" },
      { type: "Series B", year: "Jan 2024", amount: "$150M", investors: "Premji Invest, DFJ, Wing VC" },
      { type: "Series C", year: "2025-26", amount: "~$90M", status: "Ongoing" }
    ]
  },
  technology: {
    core: "Live-cell tracking + single-cell transcriptomics",
    advantages: [
      "Real-time cell behavior analysis",
      "Multi-modal data integration", 
      "High-throughput screening",
      "AI-powered cell classification"
    ],
    patents: "15+ filed, 8+ granted"
  },
  market: {
    singleCell: "$3.6B in 2023, projected $10.8B by 2030",
    multiOmics: "$5.1B in 2023, projected $13.2B by 2030",
    growth: "CAGR 15-20%"
  },
  competitors: [
    "10x Genomics (public, $2B+ revenue)",
    "Parse Biosciences (private, $65M+ funding)",
    "Bruker/Berkeley Lights (acquired)"
  ]
};

function generateResponse(message: string, context?: string): string {
  // Funding-related questions
  if (message.includes('funding') || message.includes('investment') || message.includes('money')) {
    return `Cellanome has raised ${knowledgeBase.funding.total} across multiple rounds. Most recently, they completed a $150M Series B in January 2024 led by Premji Invest, with participation from DFJ and Wing VC. They're currently raising a Series C round targeting ~$90M.`;
  }
  
  // Technology questions
  if (message.includes('technology') || message.includes('platform') || message.includes('how') || message.includes('what')) {
    return `Cellanome's core technology combines ${knowledgeBase.technology.core}. Their platform enables real-time analysis of living cells while simultaneously capturing single-cell gene expression data. Key advantages include multi-modal data integration, high-throughput screening capabilities, and AI-powered cell classification.`;
  }
  
  // Market questions
  if (message.includes('market') || message.includes('size') || message.includes('opportunity')) {
    return `The single-cell analysis market is ${knowledgeBase.market.singleCell}, while the broader multi-omics market is ${knowledgeBase.market.multiOmics}. Both markets are experiencing strong growth with a ${knowledgeBase.market.growth} compound annual growth rate.`;
  }
  
  // Competition questions
  if (message.includes('competitor') || message.includes('competition') || message.includes('vs')) {
    return `Cellanome competes primarily with ${knowledgeBase.competitors.join(', ')}. Their key differentiator is the combination of live-cell tracking with transcriptomics, which most competitors don't offer in a single platform.`;
  }
  
  // Company basics
  if (message.includes('company') || message.includes('founded') || message.includes('team')) {
    return `${knowledgeBase.company.description}, founded in ${knowledgeBase.company.founded}. The company has ${knowledgeBase.company.employees} employees and is based in the ${knowledgeBase.company.headquarters}.`;
  }
  
  // Default response
  return "I can help you understand Cellanome's funding, technology, market opportunity, and competitive position. What specific aspect would you like to know more about?";
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = generateResponse(message.toLowerCase(), context);
    
    res.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}