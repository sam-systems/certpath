import { defineConfig, devices } from "@playwright/test";

// E2E. Requiere: npm i -D @playwright/test && npx playwright install
// Lanza primero el API (:4000) y el web (:3001), o ajusta baseURL.
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3001",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
