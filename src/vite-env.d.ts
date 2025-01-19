/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_DB_HOST: string
  readonly VITE_AZURE_DB_NAME: string
  readonly VITE_AZURE_DB_USER: string
  readonly VITE_AZURE_DB_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}