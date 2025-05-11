import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core'
import { media } from '../../media/infrastructure/media.schema'
import { project } from './project.schema'

export const mediaToProject = sqliteTable(
  'media_to_project',
  {
    mediaId: text('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    projectId: text('project_id')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' })
  },
  table => [primaryKey({ columns: [table.projectId, table.mediaId] })]
)
