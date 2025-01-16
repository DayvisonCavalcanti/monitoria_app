
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wgfpwdloxjxpazckhpgi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnZnB3ZGxveGp4cGF6Y2tocGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NTQ5MjksImV4cCI6MjA1MjUzMDkyOX0.9LHXrA110MFgwck3NSWqwWdgQ1ybCGKbAC1HrWnif9I'

export const supabase = createClient(supabaseUrl, supabaseKey)