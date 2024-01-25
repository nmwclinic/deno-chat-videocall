import { Socket } from 'socket.io'
// import axiod from 'https://deno.land/x/axiod@0.26.2/mod.ts'
import jwt, { JwtPayload, VerifyErrors } from 'npm:jsonwebtoken'
import ENV from '../env.json' with { type: 'json' }
import { UserInfo } from '../modules/socket/socket.interface.ts'
import HandleError from '../utils/error.ts'
import axios from 'npm:axios'

const verifyToken = async (socket: Socket, next: (err?: Error) => void): Promise<void> => {
  const token: string | undefined | null = socket.handshake.auth['token']
  if (typeof token !== 'string' || token === undefined || token === null) {
    next(HandleError.middleware(403, 'Forbiden must have token', socket.handshake.headers))
    return
  }
  if (token === null) {
    next(HandleError.middleware(403, 'Forbiden token not exists', socket.handshake.headers))
    return
  }

  //* check user exists on db
  const exists = await axios.get(
    ENV.APP_URL.PARENT_URL + ENV.APP_URL.AUTH_USER,
    {
      headers: {
        Authorization: `Bearer ${socket.handshake.auth.token}`,
      },
    },
  )
  if (!exists) {
    next(HandleError.middleware(403, 'Forbiden token not exists', socket.handshake.headers))
  }

  await jwt.verify(token, ENV.APP_KEY, (err: VerifyErrors, decoded: string | JwtPayload | undefined) => {
    if (err !== null) {
      next(HandleError.middleware(401, 'Membutuhkan Authorization', socket.handshake.headers))
      return
    }

    if (typeof decoded === 'string' || decoded === undefined) {
      next(HandleError.middleware(401, 'Membutuhkan Authorization', socket.handshake.headers))
      return
    }

    socket.userInfo = decoded as UserInfo
    next()
  })
}

const Authenticate = { verifyToken: verifyToken }
export default Authenticate
