-- Enhanced Chat Tables Schema

-- Chat Messages Table (existing - enhanced)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  room_id TEXT DEFAULT 'general',
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'voice', 'image')),
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  edited BOOLEAN DEFAULT FALSE,
  reply_to UUID REFERENCES chat_messages(id)
);

-- Private Messages Table (existing - enhanced)
CREATE TABLE IF NOT EXISTS private_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  file_url TEXT,
  encrypted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Rooms Table (new)
CREATE TABLE IF NOT EXISTS chat_rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  is_private BOOLEAN DEFAULT FALSE,
  max_members INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message Reactions Table (new)
CREATE TABLE IF NOT EXISTS message_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- User Status Table (new)
CREATE TABLE IF NOT EXISTS user_status (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'away', 'busy')),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_room TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File Attachments Table (new)
CREATE TABLE IF NOT EXISTS file_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default chat rooms
INSERT INTO chat_rooms (id, name, description) VALUES 
('general', 'General Discussion', 'Open chat for all users'),
('crops', 'Crop Management', 'Discuss farming techniques'),
('market', 'Market Prices', 'Share market information'),
('weather', 'Weather Updates', 'Weather-related discussions'),
('expert-qa', 'Expert Q&A', 'Direct questions to agricultural experts'),
('equipment', 'Equipment Help', 'Machinery and tools discussion')
ON CONFLICT (id) DO NOTHING;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_created ON chat_messages(room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_private_messages_participants ON private_messages(sender_id, recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_reactions_message ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_user_status_updated ON user_status(updated_at DESC);

-- Row Level Security Policies
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_attachments ENABLE ROW LEVEL SECURITY;

-- Chat messages policies
CREATE POLICY "Anyone can view chat messages" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert chat messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own messages" ON chat_messages FOR UPDATE USING (auth.uid() = user_id);

-- Private messages policies
CREATE POLICY "Users can view their private messages" ON private_messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send private messages" ON private_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Recipients can update read status" ON private_messages FOR UPDATE USING (auth.uid() = recipient_id);

-- Chat rooms policies
CREATE POLICY "Anyone can view chat rooms" ON chat_rooms FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create rooms" ON chat_rooms FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Message reactions policies
CREATE POLICY "Anyone can view reactions" ON message_reactions FOR SELECT USING (true);
CREATE POLICY "Users can add reactions" ON message_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their reactions" ON message_reactions FOR DELETE USING (auth.uid() = user_id);

-- User status policies
CREATE POLICY "Anyone can view user status" ON user_status FOR SELECT USING (true);
CREATE POLICY "Users can update their own status" ON user_status FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own status" ON user_status FOR UPDATE USING (auth.uid() = user_id);

-- File attachments policies
CREATE POLICY "Anyone can view file attachments" ON file_attachments FOR SELECT USING (true);
CREATE POLICY "Users can upload files" ON file_attachments FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
