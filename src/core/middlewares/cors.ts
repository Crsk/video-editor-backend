import 'dotenv/config'
import { cors } from 'hono/cors'

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',')

export const corsMiddleware = () => {
  return cors({
    origin: (origin, _) => {
      if (allowedOrigins?.includes(origin)) return origin
      return undefined
    },
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'Access-Control-Allow-Origin'],
    maxAge: 86400,
    credentials: true
  })
}

export const authCorsMiddleware = () => {
  return cors({
    origin: (origin, _) => {
      if (allowedOrigins?.includes(origin)) return origin
      return undefined
    },
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials'],
    maxAge: 600,
    credentials: true
  })
}
