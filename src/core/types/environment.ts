import { Container } from '../../di/container'
import { User } from '../../features/user/domain/user.entity'
import { Session } from 'better-auth'

declare global {
  interface D1Database {}
}

export type AppEnvironment = {
  Bindings: {
    DB: D1Database
  }
  Variables: {
    container: Container
    user: User | null
    session: Session | null
  }
}

declare module 'hono' {
  interface ContextVariableMap {
    container: Container
    user: User | null
    session: Session | null
    auth: any
  }
}
