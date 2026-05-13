/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly VITE_BODA_CHAT_ENDPOINT?: string;
  readonly VITE_DEPLOY_TARGET?: string;
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  readonly webkitAudioContext?: typeof AudioContext;
}
