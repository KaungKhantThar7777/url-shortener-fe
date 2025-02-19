import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://short-url7.netlify.app/");
});

test("has title", async ({ page }) => {
  await expect(page).toHaveTitle(/Url Shortener/);
});

test("has input field", async ({ page }) => {
  await expect(page.getByPlaceholder(/enter url to shorten/i)).toBeVisible();
});

test("has submit button", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: /shorten button/i })
  ).toBeVisible();
});

test("has error message with invalid url", async ({ page }) => {
  const input = page.getByPlaceholder(/enter url to shorten/i);
  await input.fill("invalid url");
  await page.getByRole("button", { name: /shorten button/i }).click();

  const validationMessage = await input.evaluate(
    (el: HTMLInputElement) => el.validationMessage
  );
  expect(validationMessage).toBeTruthy();

  const isInvalid = await input.evaluate(
    (el: HTMLInputElement) => !el.checkValidity()
  );
  expect(isInvalid).toBe(true);
});

test("has short url and copy functionality", async ({ page }) => {
  const input = page.getByPlaceholder(/enter url to shorten/i);
  await input.fill("https://www.google.com");
  await page.getByRole("button", { name: /shorten button/i }).click();

  await expect(page.getByText(/shortened url:/i)).toBeVisible();

  const copyButton = page.getByRole("button", { name: /copy/i });
  await expect(copyButton).toBeVisible();

  await copyButton.click();

  const shortenedLink = page.getByRole("link");
  await expect(shortenedLink).toBeVisible();
  const href = await shortenedLink.getAttribute("href");
  expect(href).toMatch(/^https:\/\/short-url7.netlify.app\/.+\/.+$/);
});
