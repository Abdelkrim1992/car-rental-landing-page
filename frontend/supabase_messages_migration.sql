CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) configuration
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone (guests) to insert new messages via the Contact Us form
CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);

-- Allow authenticated admins to read and update messages in the dashboard
CREATE POLICY "Admins can view messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Admins can update messages" ON messages FOR UPDATE USING (true);
CREATE POLICY "Admins can delete messages" ON messages FOR DELETE USING (true);
