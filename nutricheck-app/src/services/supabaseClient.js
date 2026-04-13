import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zxgmtjlpijnualzoydzs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4Z210amxwaWpudWFsem95ZHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NzkxODYsImV4cCI6MjA4OTE1NTE4Nn0.0cgWRrxWWlmkb5__WmDIKTOPPw9xbOatJtDoSb888Ag";

export const supabase = createClient(supabaseUrl, supabaseKey);