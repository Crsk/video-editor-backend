import { User, UpdateUser } from './user.entity'
import { UserRepository } from '../infrastructure/user.repository'

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(id: string): Promise<User | undefined> {
    return this.userRepository.findById(id)
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll()
  }

  async updateUser(id: string, data: UpdateUser): Promise<User | undefined> {
    return this.userRepository.updateUser(id, data)
  }
}
