import { UserRepository } from '@/repositories/user-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'

interface RegisterUseCasesRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCasesReponse {
  user: User
}

export class RegisterUseCases {
  constructor(private usersRepository: UserRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCasesRequest): Promise<RegisterUseCasesReponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return {
      user,
    }
  }
}
