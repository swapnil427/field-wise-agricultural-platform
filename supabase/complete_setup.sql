-- =====================================================
-- COMPLETE SUPABASE SETUP FOR FIELD WISE HELP
-- =====================================================

-- 1. Create profiles table for user data
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  farm_size TEXT,
  crops TEXT[],
  role TEXT DEFAULT 'farmer' CHECK (role IN ('farmer', 'expert', 'admin')),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create chat messages table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  message TEXT NOT NULL,
  room_id TEXT DEFAULT 'general',
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'voice', 'image')),
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  edited BOOLEAN DEFAULT FALSE,
  reply_to UUID REFERENCES public.chat_messages(id)
);

-- 3. Create private messages table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.private_messages (
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

-- 4. Create chat rooms table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  is_private BOOLEAN DEFAULT FALSE,
  max_members INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create message reactions table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.message_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- 6. Create user status table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_status (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'away', 'busy')),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_room TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create file attachments table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.file_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Insert default chat rooms
-- =====================================================
INSERT INTO public.chat_rooms (id, name, description) VALUES 
  ('general', 'General Discussion', 'Open chat for all users'),
  ('crops', 'Crop Management', 'Discuss farming techniques'),
  ('market', 'Market Prices', 'Share market information'),
  ('weather', 'Weather Updates', 'Weather-related discussions'),
  ('expert-qa', 'Expert Q&A', 'Direct questions to agricultural experts'),
  ('equipment', 'Equipment Help', 'Machinery and tools discussion')
ON CONFLICT (id) DO NOTHING;

-- 9. Create indexes for better performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_created ON public.chat_messages(room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON public.chat_messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_private_messages_participants ON public.private_messages(sender_id, recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_reactions_message ON public.message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_user_status_updated ON public.user_status(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 10. Enable Row Level Security
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;

-- 11. Drop existing policies (clean slate)
-- =====================================================
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Authenticated users can insert chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can view their private messages" ON public.private_messages;
DROP POLICY IF EXISTS "Users can send private messages" ON public.private_messages;
DROP POLICY IF EXISTS "Recipients can update read status" ON public.private_messages;
DROP POLICY IF EXISTS "Anyone can view chat rooms" ON public.chat_rooms;
DROP POLICY IF EXISTS "Authenticated users can create rooms" ON public.chat_rooms;
DROP POLICY IF EXISTS "Anyone can view reactions" ON public.message_reactions;
DROP POLICY IF EXISTS "Users can add reactions" ON public.message_reactions;
DROP POLICY IF EXISTS "Users can remove their reactions" ON public.message_reactions;
DROP POLICY IF EXISTS "Anyone can view user status" ON public.user_status;
DROP POLICY IF EXISTS "Users can update their own status" ON public.user_status;
DROP POLICY IF EXISTS "Users can insert their own status" ON public.user_status;
DROP POLICY IF EXISTS "Anyone can view file attachments" ON public.file_attachments;
DROP POLICY IF EXISTS "Users can upload files" ON public.file_attachments;

-- 12. Create RLS Policies
-- =====================================================

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Chat messages policies
CREATE POLICY "Anyone can view chat messages"
  ON public.chat_messages FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert chat messages"
  ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages"
  ON public.chat_messages FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
  ON public.chat_messages FOR DELETE USING (auth.uid() = user_id);

-- Private messages policies
CREATE POLICY "Users can view their private messages"
  ON public.private_messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send private messages"
  ON public.private_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update read status"
  ON public.private_messages FOR UPDATE USING (auth.uid() = recipient_id);

-- Chat rooms policies
CREATE POLICY "Anyone can view chat rooms"
  ON public.chat_rooms FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create rooms"
  ON public.chat_rooms FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Message reactions policies
CREATE POLICY "Anyone can view reactions"
  ON public.message_reactions FOR SELECT USING (true);

CREATE POLICY "Users can add reactions"
  ON public.message_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their reactions"
  ON public.message_reactions FOR DELETE USING (auth.uid() = user_id);

-- User status policies
CREATE POLICY "Anyone can view user status"
  ON public.user_status FOR SELECT USING (true);

CREATE POLICY "Users can insert their own status"
  ON public.user_status FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own status"
  ON public.user_status FOR UPDATE USING (auth.uid() = user_id);

-- File attachments policies
CREATE POLICY "Anyone can view file attachments"
  ON public.file_attachments FOR SELECT USING (true);

CREATE POLICY "Users can upload files"
  ON public.file_attachments FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- 13. Create function to handle new user signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  
  INSERT INTO public.user_status (user_id, status)
  VALUES (NEW.id, 'online');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Create trigger for new user signup
-- =====================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 15. Create function to update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 16. Create triggers for updated_at
-- =====================================================
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON public.chat_messages;
CREATE TRIGGER update_chat_messages_updated_at
  BEFORE UPDATE ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

-- Verify tables were created
SELECT 'profiles' as table_name, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'chat_messages', COUNT(*) FROM public.chat_messages
UNION ALL
SELECT 'private_messages', COUNT(*) FROM public.private_messages
UNION ALL
SELECT 'chat_rooms', COUNT(*) FROM public.chat_rooms
UNION ALL
SELECT 'message_reactions', COUNT(*) FROM public.message_reactions
UNION ALL
SELECT 'user_status', COUNT(*) FROM public.user_status
UNION ALL
SELECT 'file_attachments', COUNT(*) FROM public.file_attachments;
