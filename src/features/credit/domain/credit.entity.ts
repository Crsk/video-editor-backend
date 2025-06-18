import { z } from 'zod'
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import { credit } from '../infrastructure/credit.schema'

export const selectCreditSchema = createSelectSchema(credit)
export const insertCreditSchema = createInsertSchema(credit)

export type Credit = z.infer<typeof selectCreditSchema>
export type CreateCredit = z.infer<typeof insertCreditSchema>
export type UpdateCredit = Partial<Omit<CreateCredit, 'id'>>
