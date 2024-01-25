import { createWorker, types as mediasoupTypes } from 'npm:mediasoup'
import mediasoupconfig from './meiasoup.interface.ts'
import { WorkerLogLevel } from 'npm:mediasoup/lib/types'
import { WorkerLogTag } from 'npm:mediasoup/lib/types'

const mediasoupWorker: mediasoupTypes.Worker[] = []
const start = async () => {
  const worker = await createWorker({
    logLevel: mediasoupconfig.logLevel as WorkerLogLevel,
    logTags: mediasoupconfig.logTags as WorkerLogTag,
  })

  mediasoupWorker.push(worker)
}

const mediaSoup = { start: start }
export default mediaSoup
