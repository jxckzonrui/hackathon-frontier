import { expect, test } from "@playwright/test";

test("creates, settles, and verifies the demo invoice lifecycle", async ({ page }) => {
  await page.goto("/dashboard");

  await page.getByRole("link", { name: "New invoice" }).click();
  await expect(page.getByRole("heading", { name: "Create encrypted invoice" })).toBeVisible();

  await page.getByRole("button", { name: "Create encrypted invoice" }).click();
  await expect(page.getByText(/invoice demo-invoice ready locally|Created invoice/)).toBeVisible();

  await page.getByRole("link", { name: "Review client flow" }).click();
  await expect(page.getByRole("heading", { name: "Review and pay" })).toBeVisible();

  await page.getByRole("button", { name: "Prepare private payment" }).click();
  await expect(
    page.getByText(/Payment proof prepared|Unsigned private payment prepared for wallet signing/),
  ).toBeVisible();

  await page.getByRole("link", { name: "Verify settlement" }).click();
  const publicPanel = page.getByLabel("Public verification");

  await expect(publicPanel).toContainText("Paid");
  await expect(publicPanel).toContainText("Payment proof");
  await expect(publicPanel).not.toContainText("2,500.00 PUSD");
  await expect(publicPanel).not.toContainText("Private audit invoice");
});
