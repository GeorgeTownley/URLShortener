import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page
    .getByRole("textbox", { name: "https://example.com/very/long" })
    .click();
  await page
    .getByRole("textbox", { name: "https://example.com/very/long" })
    .fill("https://google.com");
  await page.getByRole("button", { name: "Create Short URL" }).click();
  const page1Promise = page.waitForEvent("popup");
  await page.getByRole("link", { name: "Test your short URL →" }).click();
  const page1 = await page1Promise;
  await page1.getByRole("button", { name: "Accept all" }).click();
});
