import { UserRepository } from '@/repositories/user-repository'
import { InvalidcredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { checkIn } from '@prisma/client'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckInUseCaseResponse {
  checkIn: checkIn
}

export class CheckInUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidcredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidcredentialsError()
    }

    return {
      user,
    }
  }
}
