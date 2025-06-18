import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { Context } from 'hono'
import * as schema from '../features/auth/infrastructure/auth.schema'
import { drizzle } from 'drizzle-orm/d1'
import { AppEnvironment } from './types/environment'
import { env } from 'hono/adapter'
import { team } from '../features/team/infrastructure/team.schema'
import { userToTeam } from '../features/team/infrastructure/user_to_team.schema'
import type { User } from 'better-auth'

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
    trustedOrigins: ALLOWED_ORIGINS?.split(',') || [],
    databaseHooks: {
      user: {
        create: {
          after: async (user: User) => {
            try {
              const teamData = {
                id: user.id,
                name: 'Private',
                createdAt: new Date(),
                updatedAt: new Date()
              }

              await db.insert(team).values(teamData)

              await db.insert(userToTeam).values({
                userId: user.id,
                teamId: user.id
              })

              console.log(`Successfully created private team for user ${user.id}`)
            } catch (error) {
              console.error(`Failed to create private team for user ${user.id}:`, error)
              throw new Error(
                `Failed to create private team: ${error instanceof Error ? error.message : 'Unknown error'}`
              )
            }
          }
        }
      }
    }
  })

  authInstanceCache.set(d1db, authInstance)

  return authInstance
}

export const authMiddleware = () => {
  return async (c: Context<AppEnvironment>, next: () => Promise<any>) => {
    const session = await getAuth(c).api.getSession({ headers: c.req.raw.headers })
    console.log('Session:', session)
    console.log('Cookies:', c.req.header('cookie'))

    if (!session?.user) {
      console.log('Unauthorized: No valid session found')
      return c.json({ success: false, message: 'Unauthorized' }, 401)
    }

    c.set('userId', session.user.id)

    await next()
  }
}
export const authHandler = (c: Context<AppEnvironment>) => {
  const auth = getAuth(c)

  return auth.handler(c.req.raw)
}
