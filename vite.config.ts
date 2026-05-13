import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const githubRepositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = process.env.SITE_BASE_PATH ?? (githubRepositoryName ? `/${githubRepositoryName}/` : "/");

export default defineConfig({
  base,
  plugins: [react()],
});
