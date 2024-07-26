import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { InvalidcredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCases } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(req.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCases()

    await authenticateUseCase.execute({ email, password })
  } catch (err) {
    if (err instanceof InvalidcredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    return reply.status(500).send()
  }

  return reply.status(200).send()
}
