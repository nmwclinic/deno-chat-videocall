import { WorkerLogLevel, WorkerLogTag } from 'npm:mediasoup/lib/types'

export interface MediasoupConfig {
  listenIps: string[]
  numWorkers: number | null
  logLevel: WorkerLogLevel
  logTags: WorkerLogTag
  rtcIPv4: boolean
  rtcIPv6: boolean
  rtcAnnouncedIPv4: string | null
  rtcAnnouncedIPv6: string | null
  rtcMinPort: number | null
  rtcMaxPort: number | null
}

const mediasoupConfig: MediasoupConfig = {
  listenIps: ['0.0.0.0/0'],
  numWorkers: null,
  logLevel: 'warn',
  logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'],
  rtcIPv4: true,
  rtcIPv6: true,
  rtcAnnouncedIPv4: null,
  rtcAnnouncedIPv6: null,
  rtcMinPort: null,
  rtcMaxPort: null,
}

export default mediasoupConfig
