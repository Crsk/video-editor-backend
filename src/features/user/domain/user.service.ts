import { User, NewUser, UpdateUser } from './user.entity'
import { UserRepository } from '../infrastructure/user.repository'

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(id: number): Promise<User | undefined> {
    return this.userRepository.findById(id)
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll()
  }

  async createUser(userData: NewUser): Promise<User> {
    return this.userRepository.create(userData)
  }

  async updateUser(id: number, data: UpdateUser): Promise<User | undefined> {
    return this.userRepository.updateUser(id, data)
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.userRepository.deleteUser(id)
  }
}
