/**
 * Cucumber-style hooks for playwright-bdd.
 *
 * This is the playwright-bdd equivalent of a plain-Cucumber `hooks.ts`.
 * Instead of importing Before/After from `@cucumber/cucumber`, we get them
 * from `createBdd()`, and they receive Playwright's fixtures directly
 * (`page`, `$testInfo`, `$tags`, ...) — no custom World needed.
 *
 * Hook scopes:
 *   BeforeAll / AfterAll  -> once per worker process   (fixtures: $workerInfo)
 *   Before    / After     -> once per scenario         (fixtures: page, $testInfo, $tags, ...)
 *
 * This file lives under the `steps:` glob (src/tests/steps/**), so `bddgen`
 * bundles it automatically. Set breakpoints anywhere below and debug via the
 * Playwright Test extension — the watcher keeps .features-gen in sync.
 */
import { createBdd } from 'playwright-bdd';
import { ConfigManager } from '../../config/ConfigManager';

const { BeforeAll, Before, After, AfterAll } = createBdd();

BeforeAll(async () => {
  // One-time setup per worker: surface which environment the run targets.
  console.log(
    `[BeforeAll] env=${ConfigManager.getEnvironment()} baseUrl=${ConfigManager.getBaseUIUrl()} headless=${ConfigManager.isHeadless()}`
  );
});

Before(async ({ $testInfo, $tags }) => {
  // Runs before each scenario. `page` is already created by Playwright, so
  // there is nothing to launch here — just per-scenario bookkeeping.
  const tags = $tags.length ? ` ${$tags.join(' ')}` : '';
  console.log(`[Before] ▶ ${$testInfo.title}${tags}`);
});

After(async ({ page, $testInfo }) => {
  // On failure, attach a screenshot to the HTML report. (Playwright's
  // `screenshot: 'only-on-failure'` already saves one to disk; this makes it
  // show inline in the report and demonstrates the After hook.)
  if ($testInfo.status !== $testInfo.expectedStatus) {
    const screenshot = await page.screenshot({ fullPage: true });
    await $testInfo.attach('failure-screenshot', {
      body: screenshot,
      contentType: 'image/png',
    });
    console.log(`[After] ✖ ${$testInfo.title} (${$testInfo.status})`);
  } else {
    console.log(`[After] ✔ ${$testInfo.title}`);
  }
});

AfterAll(async () => {
  console.log('[AfterAll] worker finished');
});
