import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core'
import { user } from '../../auth/infrastructure/auth.schema'
import { workspace } from './workspace.schema'

export const userToWorkspace = sqliteTable(
  'user_to_workspace',
  {
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspace.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' })
  },
  table => [primaryKey({ columns: [table.workspaceId, table.userId] })]
)
