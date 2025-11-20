import { test, expect } from "@playwright/test";

test.describe("landing page", () => {
  test("renders marketing hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/todos/i);
  });
});
