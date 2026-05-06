import { expect, test } from "@playwright/test";

test("public verification hides private invoice details", async ({ page }) => {
  await page.goto("/verify/demo-invoice");

  await expect(page.getByText("Authorized party view")).toBeVisible();
  await expect(page.getByText("Public verification")).toBeVisible();
  await expect(page.getByText("2,500.00 PUSD")).toBeVisible();

  const publicPanel = page.getByLabel("Public verification");
  await expect(publicPanel).toContainText("Paid");
  await expect(publicPanel).toContainText("Metadata hash");
  await expect(publicPanel).toContainText("Amount commitment");
  await expect(publicPanel).not.toContainText("2,500.00 PUSD");
  await expect(publicPanel).not.toContainText("Private audit invoice");
});
