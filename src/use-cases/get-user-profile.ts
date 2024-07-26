import { UserRepository } from '@/repositories/user-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUsesProfileUseCaseRequest {
  userId: string
}

interface GetUsesProfileUseCaseResponse {
  user: User
}

export class GetUsesProfileUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({
    userId,
  }: GetUsesProfileUseCaseRequest): Promise<GetUsesProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
