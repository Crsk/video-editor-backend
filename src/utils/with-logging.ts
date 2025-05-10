import { HttpError } from './attempt/http'
import { logger } from './logger'

export const withLogging = async <T>(
  label: string,
  context: Record<string, any>,
  fn: () => Promise<[HttpError | null, T | null]>
): Promise<[HttpError | null, T | null]> => {
  const operationId = Math.random().toString(36).substring(2, 10)
  const startTime = new Date().toISOString()
  logger.info(`${label} started [${operationId}]`, { ...context, startTime, operationId })

  try {
    const [err, result] = await fn()
    const endTime = new Date().toISOString()
    const duration = new Date().getTime() - new Date(startTime).getTime()

    if (err) {
      const errorDetails =
        err instanceof Error
          ? {
              name: err.name,
              message: err.message,
              stack: err.stack,
              ...(err as any)
            }
          : err

      logger.error(`${label} failed [${operationId}]`, {
        ...context,
        err: errorDetails,
        startTime,
        endTime,
        durationMs: duration,
        operationId
      })
    } else {
      logger.info(`${label} succeeded [${operationId}]`, {
        ...context,
        startTime,
        endTime,
        durationMs: duration,
        operationId,
        resultType: result ? typeof result : 'null'
      })
    }

    return [err, result]
  } catch (unexpectedError) {
    const endTime = new Date().toISOString()
    const duration = new Date().getTime() - new Date(startTime).getTime()

    logger.error(`${label} unexpected error [${operationId}]`, {
      ...context,
      unexpectedError,
      startTime,
      endTime,
      durationMs: duration,
      operationId
    })

    return [new HttpError('INTERNAL_ERROR', 'Unexpected error occurred'), null]
  }
}
