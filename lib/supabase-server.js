// /lib/supabase-server.js
import { createClient } from '@supabase/supabase-js'

// Client serveur avec la clé de service (bypasse RLS)
// À utiliser UNIQUEMENT dans getStaticProps, getServerSideProps, ou API routes
export const supabaseServer = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
