import { Container } from '../../di/container'

declare global {
  interface D1Database {}
}

export type AppEnvironment = {
  Bindings: {
    DB: D1Database
  }
  Variables: {
    container: Container
  }
}

declare module 'hono' {
  interface ContextVariableMap {
    container: Container
  }
}
