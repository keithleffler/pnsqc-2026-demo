import { createBdd } from 'playwright-bdd';
import { HomePage } from '@src/pages/HomePage';

const { Given, Then, Before } = createBdd();
let homePage: HomePage;

Before(async ({ page }) => {
  homePage = new HomePage(page);
});
Given('the user navigates to the index page', async () => {
  await homePage.navigateToHome();
});

Then('the user should see the ParaBank logo', async () => {
  await homePage.isLogoVisible();
});

Then('the user should see the login form with fields:', async ({}, dataTable) => {
  const fields = dataTable.raw().flat();
  await homePage.verifyLoginFields(fields);
});
