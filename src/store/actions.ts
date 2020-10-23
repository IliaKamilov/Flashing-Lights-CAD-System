import shortid from "shortid";
import store from ".";
import { OnlineUserSocket } from "../socket/types";
import { CONNECTION_CHANGE, CREATE_SESSION, DepartmentsNames, JOIN_DEPARTMENT, JOIN_SESSION, LEAVE_SESSION, LobyActions, OnlineUserData, REMOVE_SESSION, SessionData, SET_LOBY, SET_PLAYER, SET_SESSION, USER_OFFLINE, USER_ONLINE } from "./types";
import * as logger from '../LoggerService'

export function getOnlineUers(): OnlineUserData[] {
    return store.getState().loby.users
}

export function getOnlineSessions(): SessionData[] {
    return store.getState().loby.sessions
}

export function isOnline(username: string): boolean {
    return Boolean(getOnlineUers().find(user => user.username === username))
}

export function getUserSession(socket: OnlineUserSocket): SessionData | false {
    let _session: SessionData | false = false
    getOnlineSessions().forEach(
        session => {
            if (session.players.find(player => player.username === socket.user.username)) {
                _session = session
            }
        }
    )
    return _session
}

export function getSessionById(id: string): SessionData | undefined {
    return store.getState().loby.sessions.find(session => session.id === id)
}

export function getPlayerState(socket: OnlineUserSocket) {
    let player: any
    const userSession = getUserSession(socket)
    getOnlineSessions().forEach(
        session => {
            const state = session.players.find(p => p.username === socket.user.username)
            player = { department: state?.department, session: userSession && userSession.id, id: state?.id }
        }
    )

    return player
}

export function setUserSession(socket: OnlineUserSocket, session: SessionData | false = false): void {
    logger.info(`${socket.user.username} ${session ? 'is in session' : 'not in session'}`, { session: session && session.id })
    let _session = session || getUserSession(socket)
    if (_session) {
        socket.join(_session.id)
    }

    socket.emit(SET_PLAYER, { data: getPlayerState(socket) })
    socket.emit(SET_SESSION, { data: _session })
}

export function userOnline(socket: OnlineUserSocket): LobyActions {
    socket.emit(CONNECTION_CHANGE, { connected: true, user: socket.user })

    socket.emit(SET_LOBY, getOnlineSessions())

    setUserSession(socket)

    return {
        type: USER_ONLINE,
        payload: socket.user
    }
}

export function getUserStatus(socket: OnlineUserSocket): OnlineUserData['status'] {
    return getOnlineUers().find(user => user.username === socket.user.username) ? 1 : 0
}

export function userOffline(socket: OnlineUserSocket): LobyActions {

    return {
        type: USER_OFFLINE,
        payload: socket.user
    }
}

export function joinDepartment(socket: OnlineUserSocket, department: DepartmentsNames): LobyActions {
    return {
        type: JOIN_DEPARTMENT,
        payload: {
            department,
            player: socket.user
        }
    }
}

export function joinSession(socket: OnlineUserSocket, session: SessionData): LobyActions {
    console.log(`${socket.user.username} joined session#${session.id}`)
    logger.info(`${socket.user.username} joined session.`, { id: session.id, maxPlayers: session.maxPlayers, players: session.players.length + 1 })
    return {
        type: JOIN_SESSION,
        payload: {
            socket,
            session
        }
    }
}

export function createSession(socket: OnlineUserSocket, input: { name: string, maxPlayers: string }): LobyActions {
    const session: SessionData = {
        name: input.name,
        maxPlayers: Number(input.maxPlayers),
        id: shortid.generate(),
        players: [socket.user]
    }

    socket.emit(SET_SESSION, { data: session })
    console.log(`Session#${session.id} created by ${socket.user.username}`)
    logger.info(`${socket.user.username} created session.`, { id: session.id, maxPlayers: session.maxPlayers, name: session.name })
    return {
        type: CREATE_SESSION,
        payload: session
    }
}

export function leaveSession(socket: OnlineUserSocket, session?: SessionData | false): LobyActions {
    // const session = getUserSession(socket)
    socket.emit(SET_SESSION, { data: false })

    console.log(`${socket.user.username} leaved session#${session ? session.id : 'error'}`)
    logger.info(`${socket.user.username} leaved session.`, { id: session && session.id, players: session && session.players.length - 1 })

    return {
        type: LEAVE_SESSION,
        payload: socket
    }
}

export function removeSession(session: SessionData): LobyActions {
    console.log(`session#${session.id} removed no players.`)
    logger.info(`Session removed becouse no players.`, { id: session.id })
    return {
        type: REMOVE_SESSION,
        payload: session
    }
}