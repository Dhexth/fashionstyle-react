/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;        // URL base de tu backend (opcional)
  readonly VITE_APP_NAME?: string;      // Nombre de tu app
  readonly VITE_ENVIRONMENT?: "dev" | "prod";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
