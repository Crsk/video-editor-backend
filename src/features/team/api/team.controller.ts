import { Context } from 'hono'
import { AppEnvironment } from '../../../core/types/environment'
import { TeamService } from '../domain/team.service'
import { withLogging } from '../../../utils/with-logging'
import { type CreateTeam, insertTeamSchema } from '../domain/team.entity'

export class TeamController {
  constructor(private teamService: TeamService) {}

  async upsertTeam(c: Context<AppEnvironment>) {
    const teamId = c.req.param('teamId')
    const teamData = await c.req.json()
    const validData: CreateTeam = insertTeamSchema.parse({ ...teamData, id: teamId })

    const [error, team] = await withLogging('Upsert team', { teamId, teamData: validData }, () =>
      this.teamService.upsertTeam({ teamData: validData })
    )

    if (error) return c.json({ success: false }, error.code)

    return c.json({ success: true, data: team }, 200)
  }

  async deleteTeam(c: Context<AppEnvironment>) {
    const teamId = c.req.param('teamId')
    const [error, team] = await withLogging('Delete team', { teamId }, () => this.teamService.deleteTeam({ teamId }))

    if (error) return c.json({ success: false }, error.code)

    return c.json({ success: true, data: team }, 200)
  }

  async getTeamCredits(c: Context<AppEnvironment>) {
    const teamId = c.req.param('teamId')
    const [error, result] = await withLogging('Get team credits', { teamId }, () =>
      this.teamService.getTeamCredits({ teamId })
    )

    if (error) {
      console.error('Error getting user credits:', error)
      return c.json({ success: false, data: { error: error.message } }, error.code)
    }

    return c.json({ success: true, data: result }, 200)
  }
}
