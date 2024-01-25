import Rediss from 'ioredis'
import Env from '../env.json' with { type: 'json' }

const redisConnections = new Rediss.Redis(Env.REDIS)

const connect = (): void => {
  redisConnections.on('connect', () => {
    console.info('Connected to Redist')
  })
}

const getConnection = (): Rediss.Redis => redisConnections

const RedisProvider = { connect, getConnection }
export default RedisProvider
