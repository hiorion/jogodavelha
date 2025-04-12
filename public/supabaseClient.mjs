import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const SUPABASE_URL = 'https://fgihhjltvwycakhrgfya.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnaWhoamx0dnd5Y2FraHJnZnlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MzgzMjgsImV4cCI6MjA2MDAxNDMyOH0.mQf_On0u-IbAL1nFwXSNYQg6v1yk6f_eo0GLKc7RQC4'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
