import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { user } from '../../auth/infrastructure/auth.schema'

export const credit = sqliteTable('credit', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})
