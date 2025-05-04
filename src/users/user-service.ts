import { IUserRepository } from './user-repository'
import { CreateUserInput, UpdateUserInput } from './user-validation'
import { User } from './user-models'

export interface IUserService {
  getUserById(id: number): Promise<User | undefined>
  getAllUsers(): Promise<User[]>
  createUser(userData: CreateUserInput): Promise<User>
  updateUser(id: number, data: UpdateUserInput): Promise<User | undefined>
  deleteUser(id: number): Promise<boolean>
}

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getUserById(id: number): Promise<User | undefined> {
    return this.userRepository.findById(id)
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll()
  }

  async createUser(userData: CreateUserInput): Promise<User> {
    return this.userRepository.create(userData)
  }

  async updateUser(id: number, data: UpdateUserInput): Promise<User | undefined> {
    return this.userRepository.updateUser(id, data)
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.userRepository.deleteUser(id)
  }
}
