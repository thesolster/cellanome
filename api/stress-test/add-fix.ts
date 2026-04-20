import type { VercelRequest, VercelResponse } from '@vercel/node';

const EXPECTED_SECRET = 'cellanome-stress-2026';
const SUPABASE_URL = 'https://pszdgleiigwpobuxckra.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzemRnbGVpaWd3cG9idXhja3JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjE5NTMsImV4cCI6MjA2MDM5Nzk1M30.RPNtCOIAwsLa9BsPMHNyIlCvbdlbmnOS0M6lMKSAlJ0';

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
  
  const { fix } = req.body;
  if (!fix || typeof fix !== 'string') {
    return res.status(400).json({ error: 'Missing fix content' });
  }
  
  try {
    // Add fix to stress_patches table
    const response = await fetch(`${SUPABASE_URL}/rest/v1/stress_patches`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        content: fix,
        status: 'pending',
        created_at: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to save fix' });
    }
    
    return res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Add fix error:', error);
    return res.status(500).json({ error: 'Failed to save fix' });
  }
}
