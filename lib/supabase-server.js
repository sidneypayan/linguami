// /lib/supabase-server.js
import { createClient } from '@supabase/supabase-js'
import { createServerClient as createSSRClient } from '@supabase/ssr'

// Client serveur avec la clé de service (bypasse RLS)
// À utiliser UNIQUEMENT dans getStaticProps, getServerSideProps, ou API routes
export const supabaseServer = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Export createServerClient for compatibility with Pages Router SSR
export { createSSRClient as createServerClient }
