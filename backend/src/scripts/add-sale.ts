import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createPriceListsWorkflow } from "@medusajs/medusa/core-flows"

// A single demo product carries a sale so the storefront renders the
// conditional sale elements (struck-through original price on the card, plus
// the discount percentage on the detail page) that the PNSQC paper's Figure 1
// asserts. USD only, so the EU region keeps its regular price and the figure's
// region contrast holds.
const SALE_TITLE = "PNSQC demo sale: T-Shirt"
const PRODUCT_HANDLE = "t-shirt"
const CURRENCY_CODE = "usd"
const SALE_AMOUNT = 10 // regular USD price is 15, so 33% off

/**
 * Adds a "sale" price list that drops the T-Shirt's USD price to $10.
 * Idempotent: skips creation if a price list with SALE_TITLE already exists.
 */
export default async function addSale({ container }: ExecArgs) {
  const logger = container.resolve("logger")
  const pricingModuleService = container.resolve(Modules.PRICING)
  const productModuleService = container.resolve(Modules.PRODUCT)

  const priceLists = await pricingModuleService.listPriceLists({})
  if (priceLists.some((pl) => pl.title === SALE_TITLE)) {
    logger.info(`Sale price list "${SALE_TITLE}" already exists; skipping.`)
    return
  }

  const [product] = await productModuleService.listProducts(
    { handle: PRODUCT_HANDLE },
    { relations: ["variants"] }
  )
  if (!product?.variants?.length) {
    logger.info(`Product "${PRODUCT_HANDLE}" not found (or no variants); skipping sale.`)
    return
  }

  const prices = product.variants.map((variant) => ({
    amount: SALE_AMOUNT,
    currency_code: CURRENCY_CODE,
    variant_id: variant.id,
  }))

  logger.info(`Creating sale price list "${SALE_TITLE}" (${prices.length} variants)...`)
  const { result } = await createPriceListsWorkflow(container).run({
    input: {
      price_lists_data: [
        {
          title: SALE_TITLE,
          description: "Author-created sale for the PNSQC paper figures (33% off the T-Shirt, USD).",
          // String values the pricing module accepts; cast keeps this script
          // independent of enum export paths across Medusa versions.
          type: "sale" as never,
          status: "active" as never,
          prices,
        },
      ],
    },
  })
  logger.info(`Created sale price list: ${result[0].id}`)
}
