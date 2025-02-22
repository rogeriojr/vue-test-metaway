interface ImportMetaEnv {
  VITE_API_URL: string
  CYPRESS_USERNAME: string
  CYPRESS_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
