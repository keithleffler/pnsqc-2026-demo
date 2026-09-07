import { Page } from '@playwright/test';
import { StorePageLocators } from '@src/support/locators/StorePageLocators';
import { ConfigManager } from '../config/ConfigManager';
import { UIActions } from '@src/helper/actions/UIActions';
import { LoadState } from '@src/support/enum/LoadState';

/**
 * The store category (listing) page: a grid of product cards. Each card is a
 * link to a product detail page and shows the product's title and price, plus
 * a struck-through original price when the product is on sale.
 */
export class StorePage {
  private uiActions: UIActions;

  constructor(page: Page) {
    this.uiActions = new UIActions(page);
  }

  async navigateToStore(region = 'us'): Promise<void> {
    const url = `${ConfigManager.getBaseUIUrl()}/${region}/store`;
    await this.uiActions.page().gotoURL(url, 'Store category page');
    await this.uiActions.page().waitForLoadState(LoadState.DOMCONTENTLOADED);
  }

  async isProductListVisible(): Promise<void> {
    await this.uiActions
      .expect()
      .expectElementToBeVisible(StorePageLocators.PRODUCTS_LIST, 'Product list should be visible');
  }

  async isProductCardVisible(handle: string): Promise<void> {
    await this.uiActions
      .expect()
      .expectElementToBeVisible(
        StorePageLocators.productCard(handle),
        `Product card for "${handle}" should be visible`
      );
  }

  async openProduct(handle: string): Promise<void> {
    await this.uiActions
      .element(StorePageLocators.productCard(handle), `Product card for "${handle}"`)
      .click();
  }

  async expectCardSalePrice(
    handle: string,
    salePrice: string,
    originalPrice: string
  ): Promise<void> {
    const expectUtils = this.uiActions.expect();
    await expectUtils.expectElementToContainText(
      StorePageLocators.cardPrice(handle),
      salePrice,
      `"${handle}" card should show the sale price ${salePrice}`
    );
    await expectUtils.expectElementToContainText(
      StorePageLocators.cardOriginalPrice(handle),
      originalPrice,
      `"${handle}" card should show the original price ${originalPrice}`
    );
  }
}
