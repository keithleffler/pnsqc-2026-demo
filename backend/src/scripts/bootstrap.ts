import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import seedDemoData from "./seed"
import addUsRegion from "./add-us-region"
import addSale from "./add-sale"

/**
 * Idempotent bootstrap run by the Docker entrypoint on every backend start:
 *   1. Seed the default demo catalog only if the store is empty.
 *   2. Ensure the United States (USD) region exists.
 *   3. Pin the publishable API key token to the fixed MEDUSA_PUBLISHABLE_KEY so
 *      the pre-built storefront (which baked the same value) can talk to the API.
 */
export default async function bootstrap(args: ExecArgs) {
  const { container } = args
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const productModuleService = container.resolve(Modules.PRODUCT)
  const [, productCount] = await productModuleService.listAndCountProducts(
    {},
    { take: 0 }
  )

  if (productCount === 0) {
    logger.info("[bootstrap] Empty catalog — seeding demo data...")
    await seedDemoData(args)
  } else {
    logger.info(`[bootstrap] ${productCount} products present — skipping seed.`)
  }

  logger.info("[bootstrap] Ensuring United States region...")
  await addUsRegion(args)

  // Demo sale for the paper figures. Wrapped so a pricing-API change can never
  // block a backend boot; the store simply renders without the sale.
  try {
    logger.info("[bootstrap] Ensuring demo sale price list...")
    await addSale(args)
  } catch (e) {
    logger.warn(`[bootstrap] Could not create demo sale: ${(e as Error).message}`)
  }

  const targetKey = process.env.MEDUSA_PUBLISHABLE_KEY
  if (targetKey) {
    try {
      const pgConnection = container.resolve(
        ContainerRegistrationKeys.PG_CONNECTION
      )
      await pgConnection.raw(
        "UPDATE api_key SET token = ? WHERE type = 'publishable' AND revoked_at IS NULL",
        [targetKey]
      )
      logger.info(`[bootstrap] Pinned publishable key to ${targetKey}`)
    } catch (e) {
      logger.warn(
        `[bootstrap] Could not pin publishable key: ${(e as Error).message}`
      )
    }
  } else {
    logger.info("[bootstrap] MEDUSA_PUBLISHABLE_KEY not set — leaving key as-is.")
  }
}
