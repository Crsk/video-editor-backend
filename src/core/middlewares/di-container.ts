import { AppEnvironment } from '../../core/types/environment'
import { createContainer } from '../middlewares/container'
import { Context } from 'hono'

export const diContainerMiddleware = () => {
  return async (c: Context<AppEnvironment>, next: () => Promise<any>) => {
    const container = createContainer(c.env)
    c.set('container', container)
    await next()
  }
}
