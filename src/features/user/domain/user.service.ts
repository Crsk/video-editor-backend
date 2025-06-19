import type { User, UpdateUser } from './user.entity'
import type { UserRepository } from '../infrastructure/user.repository'
import type { Response } from '../../../utils/attempt/http'
import type { Workspace } from '../../workspace/domain/workspace.entity'
import type { Team } from '../../team/domain/team.entity'

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserById({ userId }: { userId: string }): Promise<Response<User | undefined>> {
    return this.userRepository.findById({ userId })
  }

  async getAllUsers(): Promise<Response<User[]>> {
    return this.userRepository.findAll()
  }

  async updateUser(id: string, data: UpdateUser): Promise<Response<User | undefined>> {
    return this.userRepository.updateUser(id, data)
  }

  async getUserWorkspaces({ userId }: { userId: string }): Promise<Response<Workspace[]>> {
    return this.userRepository.getUserWorkspaces({ userId })
  }

  async getUserTeams({ userId }: { userId: string }): Promise<Response<Team[]>> {
    return this.userRepository.getUserTeams({ userId })
  }

  async getUserTeam({ userId, teamId }: { userId: string; teamId: string }): Promise<Response<Team | undefined>> {
    return this.userRepository.getUserTeam({ userId, teamId })
  }
}
