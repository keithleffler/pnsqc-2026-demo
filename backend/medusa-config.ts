import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // Medusa runs every module's migrations concurrently, each holding a
    // connection for the duration. The default Knex pool (max 10) is smaller
    // than the module count (~25), so on a fresh DB the migrations deadlock
    // waiting on the pool ("KnexTimeoutError: pool is probably full") and never
    // complete. Raising max above the module count fixes it. ssl:false because
    // the bundled Postgres container does not serve TLS.
    databaseDriverOptions: {
      connection: { ssl: false },
      pool: { min: 2, max: 40 },
    },
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  }
})
