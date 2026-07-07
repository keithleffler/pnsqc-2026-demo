import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  createTaxRegionsWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * Adds a United States (USD) region alongside the seeded Europe region.
 * Idempotent: skips creation if a "United States" region already exists.
 * The seeded product variants already carry USD prices, so the storefront
 * renders prices under /us without further changes.
 */
export default async function addUsRegion({ container }: ExecArgs) {
  const logger = container.resolve("logger")
  const regionModuleService = container.resolve(Modules.REGION)

  const existing = await regionModuleService.listRegions({
    name: "United States",
  })

  if (existing.length) {
    logger.info(`US region already exists (${existing[0].id}); skipping.`)
    return
  }

  logger.info("Creating United States region...")
  const { result } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "United States",
          currency_code: "usd",
          countries: ["us"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  })
  logger.info(`Created US region: ${result[0].id}`)

  try {
    await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: "us", provider_id: "tp_system" }],
    })
    logger.info("Created US tax region.")
  } catch (e) {
    logger.info(`Skipped US tax region: ${(e as Error).message}`)
  }
}
