import { type TeamRepository } from '../infrastructure/team.repository'
import { type CreateTeam, type Team } from './team.entity'
import { type Response } from '../../../utils/attempt/http'

export class TeamService {
  constructor(private teamRepository: TeamRepository) {}

  async upsertTeam({ teamData }: { teamData: CreateTeam }): Promise<Response<Team | undefined>> {
    return this.teamRepository.upsertTeam({ teamData })
  }

  async deleteTeam({ teamId }: { teamId: string }): Promise<Response<Team | undefined>> {
    return this.teamRepository.deleteTeam({ teamId })
  }

  async getTeamCredits({ teamId }: { teamId: string }): Promise<Response<number>> {
    return this.teamRepository.getTeamCreditBalance({ teamId })
  }
}
