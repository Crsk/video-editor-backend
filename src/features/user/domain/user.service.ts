import { User, UpdateUser } from './user.entity'
import { UserRepository } from '../infrastructure/user.repository'
import { Response } from '../../../utils/attempt/http'
import { Project } from '../../project/domain/project.entity'

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

  async getUserProjects({ userId }: { userId: string }): Promise<Response<Project[]>> {
    return this.userRepository.getUserProjects({ userId })
  }
}
