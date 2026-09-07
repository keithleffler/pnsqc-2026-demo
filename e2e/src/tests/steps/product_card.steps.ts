import { createBdd } from 'playwright-bdd';
import { StorePage } from '@src/pages/StorePage';
import { ProductDetailPage } from '@src/pages/ProductDetailPage';

const { Given, When, Then, Before } = createBdd();

let storePage: StorePage;
let productDetailPage: ProductDetailPage;

Before(async ({ page }) => {
  storePage = new StorePage(page);
  productDetailPage = new ProductDetailPage(page);
});

Given('a shopper is on the {string} store category page', async ({}, region: string) => {
  await storePage.navigateToStore(region);
  await storePage.isProductListVisible();
});

When('they open the {string} product card', async ({}, handle: string) => {
  await storePage.openProduct(handle);
});

Then('they should be on the {string} product detail page', async ({}, handle: string) => {
  await productDetailPage.expectOnProductDetailPage(handle);
});

Then('they should see the {string} product card', async ({}, handle: string) => {
  await storePage.isProductCardVisible(handle);
});

Then(
  'the {string} card should show sale price {string} and original price {string}',
  async ({}, handle: string, salePrice: string, originalPrice: string) => {
    await storePage.expectCardSalePrice(handle, salePrice, originalPrice);
  }
);

Then(
  'they should see the title, description, price, options, and Add to Cart button',
  async () => {
    await productDetailPage.expectCoreComponentsVisible();
  }
);

Then(
  'the detail page should show sale price {string}, original price {string}, and discount {string}',
  async ({}, salePrice: string, originalPrice: string, discount: string) => {
    await productDetailPage.expectSalePricing(salePrice, originalPrice, discount);
  }
);

Then('they should see the related products', async () => {
  await productDetailPage.areRelatedProductsVisible();
});

When('they view the {string} product in the {string} region', async ({}, handle: string, region: string) => {
  await productDetailPage.navigateToProduct(handle, region);
});

Then('the price should be shown in {string}', async ({}, currencySymbol: string) => {
  await productDetailPage.expectPriceInCurrency(currencySymbol);
});

Then('the sale badge should not appear', async () => {
  await productDetailPage.expectNoSaleBadge();
});

When('they open the {string} related product', async ({}, handle: string) => {
  await productDetailPage.openRelatedProduct(handle);
});
