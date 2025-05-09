import { ContentfulStatusCode } from 'hono/utils/http-status'

export type ErrorType =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'
  | 'BAD_REQUEST'

export const ErrorStatusMap: Record<ErrorType, { code: ContentfulStatusCode; message: string }> = {
  VALIDATION_ERROR: { code: 400, message: 'Validation error' },
  NOT_FOUND: { code: 404, message: 'Not found' },
  UNAUTHORIZED: { code: 401, message: 'Unauthorized' },
  FORBIDDEN: { code: 403, message: 'Forbidden' },
  CONFLICT: { code: 409, message: 'Conflict' },
  INTERNAL_ERROR: { code: 500, message: 'Internal error' },
  BAD_REQUEST: { code: 400, message: 'Bad request' }
}

export class HttpError extends Error {
  readonly type: ErrorType
  readonly code: ContentfulStatusCode

  constructor(type: ErrorType = 'INTERNAL_ERROR', message?: string) {
    super(message || ErrorStatusMap[type]?.message)
    this.name = 'HttpError'
    this.type = type
    this.code = ErrorStatusMap[type]?.code || 500
  }
}
