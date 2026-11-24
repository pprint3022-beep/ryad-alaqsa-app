/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend origin, e.g. http://localhost:3001. Defaults to the local API. */
  readonly VITE_API_URL?: string
  /** Static-hosting demo: answer API calls locally instead of reaching a server. */
  readonly VITE_STATIC_DEMO?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
