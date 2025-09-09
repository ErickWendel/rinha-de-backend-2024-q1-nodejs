import './infra/monitoring/otel'

import fastify, { type FastifyInstance } from 'fastify'
import { type IncomingMessage, type Server, type ServerResponse } from 'http'
import router from './infra/routers/router'

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
  fastify({ logger: false })

void server.register(router)

server.listen({ port: 8080, host: '0.0.0.0' }, () => {
  console.log('running on port 8080')
})

const errors = ['uncaughtException', 'unhandledRejection', 'SIGTERM', 'SIGINT']

errors.forEach((error) => {
  process.on(error, async (err) => {
    console.error('Error: ', err)
    await server.close()
    process.exit(1)
  })
})