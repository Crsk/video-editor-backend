import { HttpError } from './attempt/http'
import { logger } from './logger'

export const withLogging = async <T>(
  label: string,
  context: Record<string, any>,
  fn: () => Promise<[HttpError | null, T | null]>
): Promise<[HttpError | null, T | null]> => {
  logger.info(`${label} started`, context)
  const [err, result] = await fn()

  if (err) logger.error(`${label} failed`, { ...context, err })
  else logger.info(`${label} succeeded`, context)

  return [err, result]
}
