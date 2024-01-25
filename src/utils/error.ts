import { Socket } from 'socket.io'
import { IncomingHttpHeaders } from 'node:http'

interface CustomError extends Error {
  data: { status: boolean; code: number; error: string }
}

const emitClient = (socket: Socket, error: unknown): void => {
  let error_msg
  if (error instanceof Error) {
    error_msg = error.message
    socket.emit('error', { status: false, code: 400, error: error.message })
  } else {
    error_msg = 'Server Error'
    socket.emit('error', { status: false, code: 500, error: error_msg })
  }
  console.error(
    '[\x1b[31m%s\x1b[0m]',
    'ERROR',
    `ORIGIN: ${socket.handshake.headers.origin}`,
    `MSG: ${error_msg}`,
    `AGENT: ${socket.handshake.headers['user-agent']}`,
  )
  console.error(error)
}

const message = (error: unknown): Error => {
  if (error instanceof Error) {
    return new Error(error.message)
  } else {
    return new Error('Server Error')
  }
}

const middleware = (code: number, msg: string, headers: IncomingHttpHeaders): Error => {
  const error = new Error('Something went wrong') as CustomError
  error.data = { status: false, code: code, error: msg }
  console.error(
    '[\x1b[31m%s\x1b[0m]',
    'ERROR',
    `ORIGIN: ${headers.origin}`,
    `MSG: ${msg}`,
    `AGENT: ${headers['user-agent']}`,
  )
  console.error(error)
  return error
}

const HandleError = { emitClient: emitClient, message: message, middleware: middleware }
export default HandleError
