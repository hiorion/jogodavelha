import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient(
  'https://fgihhjltvwycakhrgfya.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnaWhoamx0dnd5Y2FraHJnZnlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MzgzMjgsImV4cCI6MjA2MDAxNDMyOH0.mQf_On0u-IbAL1nFwXSNYQg6v1yk6f_eo0GLKc7RQC4'
);