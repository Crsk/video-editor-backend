import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core'
import { user } from '../../auth/infrastructure/auth.schema'
import { project } from './project.schema'

export const userToProject = sqliteTable(
  'user_to_project',
  {
    projectId: text('project_id')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' })
  },
  table => [primaryKey({ columns: [table.projectId, table.userId] })]
)
