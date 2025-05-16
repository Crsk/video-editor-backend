import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core'
import { media } from '../../media/infrastructure/media.schema'
import { workspace } from './workspace.schema'

export const mediaToWorkspace = sqliteTable(
  'media_to_workspace',
  {
    mediaId: text('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspace.id, { onDelete: 'cascade' })
  },
  table => [primaryKey({ columns: [table.workspaceId, table.mediaId] })]
)
