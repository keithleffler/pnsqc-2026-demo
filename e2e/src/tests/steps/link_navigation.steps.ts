import { createBdd } from 'playwright-bdd';
import { NavigationPage } from '@src/pages/NavigationPage';

const { Given, When, Then, Before } = createBdd();

let navigationPage: NavigationPage;

Before(async ({ page }) => {
  navigationPage = new NavigationPage(page);
});

Given('a shopper is on the {string} page', async ({}, path: string) => {
  await navigationPage.goToPath(path);
});

When('they click the {string} link', async ({}, locator: string) => {
  await navigationPage.clickLink(locator);
});

Then('they should land on the {string} page', async ({}, path: string) => {
  await navigationPage.expectOnPath(path);
});
