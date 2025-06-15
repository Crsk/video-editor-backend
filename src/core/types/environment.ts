import { Container } from '../../core/middlewares/container'

declare global {
  interface D1Database {}
  interface AI {
    run: (model: string, data: any) => Promise<any>
  }
  interface R2Bucket {}
}

export type AppEnvironment = {
  Bindings: {
    DB: D1Database
    AI: AI
    R2: R2Bucket
    R2_PUBLIC_URL: string
    STRIPE_PUBLISHABLE_KEY: string
    STRIPE_WEBHOOK_SECRET: string
  }
  Variables: {
    container: Container
    userId: string
  }
}

declare module 'hono' {
  interface ContextVariableMap {
    container: Container
    userId: string
  }
}
