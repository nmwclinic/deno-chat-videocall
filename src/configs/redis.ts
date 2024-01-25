import { connect } from 'https://deno.land/x/redis@v0.32.1/mod.ts'
import Env from '../env.json' with { type: 'json' }

const redisUrl = new URL(Env.REDIS)
const redisConnection = await connect({
  hostname: redisUrl.hostname,
  port: parseInt(redisUrl.port || '6379'),
  db: parseInt(redisUrl.pathname.substr(1) || '0'),
})
const connects = async (): Promise<void> => {
  await redisConnection.connect()
  {
    console.info('Connected to Redist')
  }
}

const Database = { connects }
export { Database, redisConnection }
