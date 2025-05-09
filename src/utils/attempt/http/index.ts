import { HttpError, ErrorType } from './error'

export type Response<T> = [HttpError | null, T | null]

export const attempt = async <T>(promise: Promise<T>): Promise<Response<T>> => {
  try {
    return [null, await promise]
  } catch (err) {
    const errorType = (err as { type?: ErrorType }).type || 'INTERNAL_ERROR'
    const message = (err as Error)?.message

    return [new HttpError(errorType as ErrorType, message), null]
  }
}

export { HttpError }
