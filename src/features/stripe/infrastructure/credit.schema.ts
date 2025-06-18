import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { team } from '../../team/infrastructure/team.schema'

export const credit = sqliteTable('credit', {
  id: text('id').primaryKey(),
  teamId: text('team_id')
    .notNull()
    .references(() => team.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})
