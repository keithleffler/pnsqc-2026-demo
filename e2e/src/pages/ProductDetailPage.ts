import { Page } from '@playwright/test';
import { ProductDetailPageLocators } from '@src/support/locators/ProductDetailPageLocators';
import { ConfigManager } from '../config/ConfigManager';
import { UIActions } from '@src/helper/actions/UIActions';
import { LoadState } from '@src/support/enum/LoadState';

/**
 * The product detail page (PDP): title, description, price, options, and an
 * Add to Cart button, with a related-products grid below. Pricing is
 * region-aware (USD under /us, EUR under an EU country code), and a sale
 * surfaces a struck-through original price plus a discount percentage.
 */
export class ProductDetailPage {
  private uiActions: UIActions;

  constructor(page: Page) {
    this.uiActions = new UIActions(page);
  }

  async navigateToProduct(handle: string, region = 'us'): Promise<void> {
    const url = `${ConfigManager.getBaseUIUrl()}/${region}/products/${handle}`;
    await this.uiActions.page().gotoURL(url, `Product detail page: ${handle}`);
    await this.uiActions.page().waitForLoadState(LoadState.DOMCONTENTLOADED);
  }

  async expectOnProductDetailPage(handle: string): Promise<void> {
    const expectUtils = this.uiActions.expect();
    await expectUtils.expectPageToHaveURL(
      new RegExp(`/products/${handle}(\\?|$)`),
      `URL should be the "${handle}" product detail page`
    );
    await expectUtils.expectElementToBeVisible(
      ProductDetailPageLocators.CONTAINER,
      'Product detail container should be visible'
    );
  }

  async expectCoreComponentsVisible(): Promise<void> {
    const expectUtils = this.uiActions.expect();
    await expectUtils.expectElementToBeVisible(
      ProductDetailPageLocators.TITLE,
      'Product title should be visible'
    );
    await expectUtils.expectElementToBeVisible(
      ProductDetailPageLocators.DESCRIPTION,
      'Product description should be visible'
    );
    await expectUtils.expectElementToBeVisible(
      ProductDetailPageLocators.PRICE,
      'Product price should be visible'
    );
    // A product carries one options group per option (e.g. Size and Color), so
    // assert the first group is shown rather than requiring a single match.
    await expectUtils.expectElementToBeVisible(
      this.uiActions.element(ProductDetailPageLocators.OPTIONS, 'Product options').first(),
      'Product options should be visible'
    );
    await expectUtils.expectElementToBeVisible(
      ProductDetailPageLocators.ADD_TO_CART,
      'Add to Cart button should be visible'
    );
  }

  async expectSalePricing(
    salePrice: string,
    originalPrice: string,
    discount: string
  ): Promise<void> {
    const expectUtils = this.uiActions.expect();
    await expectUtils.expectElementToContainText(
      ProductDetailPageLocators.PRICE,
      salePrice,
      `Detail page should show the sale price ${salePrice}`
    );
    await expectUtils.expectElementToBeVisible(
      ProductDetailPageLocators.ORIGINAL_PRICE,
      'Struck-through original price should be visible when on sale'
    );
    await expectUtils.expectElementToContainText(
      ProductDetailPageLocators.ORIGINAL_PRICE,
      originalPrice,
      `Detail page should show the original price ${originalPrice}`
    );
    await expectUtils.expectElementToContainText(
      ProductDetailPageLocators.CONTAINER,
      discount,
      `Detail page should show the discount ${discount}`
    );
  }

  async expectPriceInCurrency(currencySymbol: string): Promise<void> {
    await this.uiActions
      .expect()
      .expectElementToContainText(
        ProductDetailPageLocators.PRICE,
        currencySymbol,
        `Price should be shown in ${currencySymbol}`
      );
  }

  async expectNoSaleBadge(): Promise<void> {
    await this.uiActions
      .expect()
      .expectElementToBeHidden(
        ProductDetailPageLocators.ORIGINAL_PRICE,
        'Sale (original) price should not appear when the product is not on sale'
      );
  }

  async areRelatedProductsVisible(): Promise<void> {
    await this.uiActions
      .expect()
      .expectElementToBeVisible(
        ProductDetailPageLocators.RELATED,
        'Related products should be visible'
      );
  }

  async openRelatedProduct(handle: string): Promise<void> {
    await this.uiActions
      .element(ProductDetailPageLocators.relatedProduct(handle), `Related product "${handle}"`)
      .click();
  }
}
