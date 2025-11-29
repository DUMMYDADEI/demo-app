-- SQL Script to Enable Real-time for Messages Table
-- Run this in your Supabase SQL Editor if notifications aren't working

-- Enable replica identity for messages table
-- This ensures we get complete row data in real-time updates
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add the messages table to the realtime publication
-- This activates real-time functionality for the table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Verify the setup
-- Run this to check if messages table is in the publication
SELECT 
    schemaname, 
    tablename 
FROM 
    pg_publication_tables 
WHERE 
    pubname = 'supabase_realtime' 
    AND tablename = 'messages';

-- If you see a row returned, real-time is properly configured!

-- Optional: Enable real-time for other tables if needed
-- ALTER TABLE public.groups REPLICA IDENTITY FULL;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.groups;

-- ALTER TABLE public.group_members REPLICA IDENTITY FULL;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.group_members;
