import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import type { Config } from 'drizzle-kit'

const config: Config = defineConfig({
  out: './drizzle/migrations',
  schema: './src/db/schema/index.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!
  }
})

export default config
