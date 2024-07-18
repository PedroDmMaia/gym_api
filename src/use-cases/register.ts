import { UserRepository } from '@/repositories/user-repository'
import { hash } from 'bcryptjs'

interface RegisterUseCasesRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCases {
  constructor(private usersRepository: UserRepository) {}

  async execute({ name, email, password }: RegisterUseCasesRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error('Email already registered')
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
