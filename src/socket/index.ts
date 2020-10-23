import SocketIo from 'socket.io'
import Https from 'https'
import { decodeToken } from '../constants/jwt'
import UserModel from '../db/models/UserModel'
import { isOnline } from '../store/actions'
import { OnlineUserData } from '../store/types'
import { onConnection } from './events'
import { OnlineUserSocket } from './types'

async function AuthorizeConnection(socket: any, next: (err?: Error) => void) {
    const token = socket.handshake.query.token

    if (!token)
        return next(Error('Connection denied token not provided.'))

    const decoded = decodeToken(token)

    const registered = await UserModel.findById(decoded.id)

    if (isOnline(registered?.username || decoded.username))
        return next(Error('Alredy connected.'))

    const user: OnlineUserData = { status: 1, id: registered?.id || null, username: registered?.username || decoded.username, registered: Boolean(registered) }
    socket.user = user

    next()
}

const createIoServer = (https: Https.Server) => {
    const io: SocketIo.Server = SocketIo(https)

    io.use(AuthorizeConnection)

    io.on('connection', (socket: OnlineUserSocket) => onConnection(socket, io))
}

export default createIoServer