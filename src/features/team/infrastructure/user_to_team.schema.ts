import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core'
import { user } from '../../auth/infrastructure/auth.schema'
import { team } from './team.schema'

export const userToTeam = sqliteTable(
  'user_to_team',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    teamId: text('team_id')
      .notNull()
      .references(() => team.id, { onDelete: 'cascade' })
  },
  table => [primaryKey({ columns: [table.teamId, table.userId] })]
)
