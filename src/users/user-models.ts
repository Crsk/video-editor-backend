import users from './user-schema'

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
