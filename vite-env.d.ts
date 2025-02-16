/// <reference types="vite/client" />
// Vite configuration should be in a separate .ts file, not in a declaration file
interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_BIBLE_API_KEY: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  
  