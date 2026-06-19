import { test, expect } from "@playwright/test";

test("home carga y muestra categorías", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Categorías", { exact: false })).toBeVisible();
});

test("el catálogo lista certificaciones", async ({ page }) => {
  await page.goto("/certificaciones");
  await expect(page.getByRole("heading", { name: "Certificaciones" })).toBeVisible();
});

test("el buscador global responde", async ({ page }) => {
  await page.goto("/buscar?q=azure");
  await expect(page.getByText("resultados", { exact: false })).toBeVisible();
});

test("un roadmap renderiza su diagrama", async ({ page }) => {
  await page.goto("/roadmaps/ai-engineer");
  await expect(page.getByText("Fundamentos", { exact: false })).toBeVisible();
});

test("recursos muestra enlaces", async ({ page }) => {
  await page.goto("/recursos");
  await expect(page.getByRole("heading", { name: "Recursos y enlaces" })).toBeVisible();
});
