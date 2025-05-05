import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { Context } from 'hono'
import * as schema from './infrastructure/auth.schema'
import { drizzle } from 'drizzle-orm/d1'
import { AppEnvironment } from '../../core/types/environment'
import { env } from 'hono/adapter'

const authInstanceCache = new WeakMap()

export const getAuth = (c: Context<AppEnvironment>) => {
  const d1db: AppEnvironment['Bindings']['DB'] = c.env.DB

  if (authInstanceCache.has(d1db)) return authInstanceCache.get(d1db)

  const db = drizzle(d1db)

  const { BETTER_AUTH_SECRET, BETTER_AUTH_URL, ALLOWED_ORIGINS, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = env<{
    BETTER_AUTH_SECRET: string
    BETTER_AUTH_URL: string
    ALLOWED_ORIGINS: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
  }>(c)

  const authInstance = betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema
    }),
    socialProviders: {
      google: {
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET
      }
    },
    advanced: {
      crossSubDomainCookies: {
        enabled: true
      },
      defaultCookieAttributes: {
        sameSite: 'none',
        secure: true
      }
    },
    secret: BETTER_AUTH_SECRET,
    baseURL: BETTER_AUTH_URL,
    trustedOrigins: ALLOWED_ORIGINS?.split(',') || []
  })

  authInstanceCache.set(d1db, authInstance)

  return authInstance
}

export const authMiddleware = () => {
  return async (c: Context<AppEnvironment>, next: () => Promise<any>) => {
    c.set('auth', getAuth(c))
    await next()
  }
}
