import { FastifyInstance } from 'fastify'
import { register } from './controllers/register.controllers'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
}
