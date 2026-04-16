-- Cellanome Knowledge Base Schema
-- Run this in Supabase SQL Editor

-- Knowledge base sections table
CREATE TABLE IF NOT EXISTS kb_sections (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT,
  section_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge base chunks for detailed content (team, investors, patents, etc.)
CREATE TABLE IF NOT EXISTS kb_chunks (
  id SERIAL PRIMARY KEY,
  section_id TEXT REFERENCES kb_sections(id),
  chunk_type TEXT, -- 'content', 'quote', 'stat', 'team', 'investor', 'patent', 'publication', 'competitor', 'risk', 'timeline', 'application'
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company info table
CREATE TABLE IF NOT EXISTS kb_company (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT,
  founded TEXT,
  headquarters TEXT,
  industry TEXT,
  status TEXT,
  employees TEXT,
  total_raised TEXT,
  mission TEXT,
  one_liner TEXT,
  metadata JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat history for analytics
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  session_id TEXT,
  role TEXT, -- 'user' or 'assistant'
  content TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE kb_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_company ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to knowledge base
CREATE POLICY "Public read access for kb_sections" ON kb_sections FOR SELECT USING (true);
CREATE POLICY "Public read access for kb_chunks" ON kb_chunks FOR SELECT USING (true);
CREATE POLICY "Public read access for kb_company" ON kb_company FOR SELECT USING (true);

-- Allow insert for chat messages (anyone can chat)
CREATE POLICY "Public insert for chat_messages" ON chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read for chat_messages" ON chat_messages FOR SELECT USING (true);

-- Create index for faster section lookups
CREATE INDEX IF NOT EXISTS idx_kb_chunks_section ON kb_chunks(section_id);
CREATE INDEX IF NOT EXISTS idx_kb_chunks_type ON kb_chunks(chunk_type);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
