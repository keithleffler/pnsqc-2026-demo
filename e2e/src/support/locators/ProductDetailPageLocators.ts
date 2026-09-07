// The detail page renders the title/description/price/actions inside
// `product-container`; the related-products grid is a sibling. Scoping the
// "main product" selectors to the container keeps the related-product cards
// (which reuse product-title/price/wrapper testids) out of these matches.
// `:visible` picks the desktop element out of the desktop/mobile pair the
// storefront renders for price, options, and the add-to-cart button.
const MAIN = '[data-testid="product-container"]';

export class ProductDetailPageLocators {
  static readonly CONTAINER = MAIN;
  static readonly TITLE = `${MAIN} [data-testid="product-title"]`;
  static readonly DESCRIPTION = `${MAIN} [data-testid="product-description"]`;
  static readonly PRICE = `${MAIN} [data-testid="product-price"]:visible`;
  static readonly ORIGINAL_PRICE = `${MAIN} [data-testid="original-product-price"]:visible`;
  static readonly ADD_TO_CART = `${MAIN} [data-testid="add-product-button"]:visible`;
  static readonly OPTIONS = `${MAIN} [data-testid="product-options"]:visible`;
  static readonly RELATED = '[data-testid="related-products-container"]';

  /** A related-product card link to the given handle. */
  static relatedProduct(handle: string): string {
    return `[data-testid="related-products-container"] a[href$="/products/${handle}"]`;
  }
}
