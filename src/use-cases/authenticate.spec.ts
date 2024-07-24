import { describe, it, expect } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/prisma/in-memory/in-memory-usersrepository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidcredentialsError } from './errors/invalid-credentials-error'

describe('register use case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUserRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'Jhon Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUserRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidcredentialsError)
  })

  it('should not be able to authenticate with wrong passaword', async () => {
    const usersRepository = new InMemoryUserRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'Jhon Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidcredentialsError)
  })
})
