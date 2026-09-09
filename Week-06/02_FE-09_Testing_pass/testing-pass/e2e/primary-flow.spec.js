import { test, expect } from "@playwright/test";

// The primary flow: a person types a message, sends it, and sees the
// assistant's reply. The AI backend is intercepted at the network layer —
// this test never depends on, or calls, the real API.
test("user sends a chat message and sees the assistant reply", async ({ page }) => {
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        parts: [{ type: "text", content: "Playwright says hi!" }],
      }),
    });
  });

  await page.goto("/");

  await page.getByLabel("Message").fill("Hello from the e2e test");
  await page.getByRole("button", { name: "Send" }).click();

  await expect(page.getByText("Playwright says hi!")).toBeVisible();
});
