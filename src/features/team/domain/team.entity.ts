import { z } from 'zod'
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import { team } from '../infrastructure/team.schema'

export const selectTeamSchema = createSelectSchema(team)
export const insertTeamSchema = createInsertSchema(team)

export type Team = z.infer<typeof selectTeamSchema>
export type CreateTeam = z.infer<typeof insertTeamSchema>
export type UpdateTeam = Partial<Omit<CreateTeam, 'id'>>
