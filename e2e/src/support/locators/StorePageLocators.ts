export class StorePageLocators {
  static readonly PRODUCTS_LIST = '[data-testid="products-list"]';
  static readonly STORE_PAGE_TITLE = '[data-testid="store-page-title"]';

  /** The clickable product card: the <a> whose href targets the product handle. */
  static productCard(handle: string): string {
    return `a[href$="/products/${handle}"]`;
  }

  /** The calculated (current) price shown on a given product's card. */
  static cardPrice(handle: string): string {
    return `a[href$="/products/${handle}"] [data-testid="price"]`;
  }

  /** The struck-through original price, rendered on a card only when on sale. */
  static cardOriginalPrice(handle: string): string {
    return `a[href$="/products/${handle}"] [data-testid="original-price"]`;
  }
}
