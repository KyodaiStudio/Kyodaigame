import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ompmshdeeckbfudgdhzg.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tcG1zaGRlZWNrYmZ1ZGdkaHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODkxMDIsImV4cCI6MjA2Nzk2NTEwMn0.fWbr85WIdqEjt8Y5lgvJgC0BfTLOFDPK21-hoOnu0JQ"

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export const createClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

export const supabase = createClient()
