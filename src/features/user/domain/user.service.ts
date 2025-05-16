import { User, UpdateUser } from './user.entity'
import { UserRepository } from '../infrastructure/user.repository'
import { Response } from '../../../utils/attempt/http'
import { Workspace } from '../../workspace/domain/workspace.entity'

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(id: string): Promise<Response<User | undefined>> {
    return this.userRepository.findById(id)
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
}
