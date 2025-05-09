import { Context } from 'hono'
import { AppEnvironment } from '../types/environment'

export const tryCatchMiddleware = () => {
  return async (c: Context<AppEnvironment>, next: () => Promise<any>) => {
    try {
      await next()
    } catch (error) {
      console.error('Error in try-catch middleware:', error)
      return c.json({ success: false, message: 'Internal Server Error' }, 500)
    }
  }
}
