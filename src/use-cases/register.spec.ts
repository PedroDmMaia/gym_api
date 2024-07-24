import { describe, it, expect } from 'vitest'
import { RegisterUseCases } from './register'
import { InMemoryUserRepository } from '@/repositories/prisma/in-memory/in-memory-usersrepository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { compare } from 'bcryptjs'

describe('register use case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCases(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Jhon Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registation', async () => {
    const usersRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCases(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Jhon Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswodCorrectlyHashed = await compare('123456', user.password_hash)

    expect(isPasswodCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with the same email twice', async () => {
    const usersRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCases(usersRepository)

    const email = 'johndoe@example.com'

    await registerUseCase.execute({
      name: 'Jhon Doe',
      email,
      password: 'password123',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'Jane Doe',
        email,
        password: 'password456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
