import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL || 'https://pmqbvwghylmbkqysazss.supabase.co'
)?.replace(/\/rest\/v1\/?$/, '')

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcWJ2d2doeWxtYmtxeXNhenNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4MzY5NzIsImV4cCI6MjEwNzQxMjk3Mn0.6p0uv-IeVmfuNfxUeFhX6FX1dhFj_DnuFIirtTyTHoA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
