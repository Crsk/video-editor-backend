import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core'
import { video } from '../../video/infrastructure/video.schema'
import { project } from './project.schema'

export const videoToProject = sqliteTable(
  'video_to_project',
  {
    videoId: text('video_id')
      .notNull()
      .references(() => video.id, { onDelete: 'cascade' }),
    projectId: text('project_id')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' })
  },
  table => [primaryKey({ columns: [table.projectId, table.videoId] })]
)
