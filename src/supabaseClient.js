import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wfaatlmphmubojtawvvv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmYWF0bG1waG11Ym9qdGF3dnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MTU4OTQsImV4cCI6MjA0ODk5MTg5NH0.IGBiY5TnDFyBIXHgTOSE5SbLwkzo6GJmIGYhHZienTY'

export const supabase = createClient(supabaseUrl, supabaseKey)
