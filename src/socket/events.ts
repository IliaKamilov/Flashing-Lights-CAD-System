import store from '../store';
import { createSession, getOnlineSessions, getOnlineUers, getPlayerState, getSessionById, getUserSession, joinDepartment, joinSession, leaveSession, removeSession, userOffline, userOnline } from '../store/actions';
import { CREATE_SESSION, DepartmentsNames, GET_LOBY, JOIN_DEPARTMENT, JOIN_SESSION, LEAVE_SESSION, SET_LOBY, SET_PLAYER, SET_SESSION } from '../store/types';
import { OnlineUserSocket } from "./types";
import * as logger from '../LoggerService'
import chalk from 'chalk';

export function onConnection(socket: OnlineUserSocket, io: SocketIO.Server): void {
    const dispatch = store.dispatch
    dispatch(userOnline(socket))

    logger.info(`${socket.user.username} connected.`, { socket: socket.id, user: socket.user.id })

    socket.on(GET_LOBY, () => socket.emit(SET_LOBY, getOnlineSessions()))

    socket.on(CREATE_SESSION, (input: { name: string, maxPlayers: string }) => {
        dispatch(createSession(socket, input))

        const session = getUserSession(socket)
        if (session) {
            updateSession(session.id)
            socket.join(session.id)
        }

        upadteLoby()
    })

    socket.on(LEAVE_SESSION, () => {
        const session = getUserSession(socket)
        dispatch(leaveSession(socket, session))

        if (session) {
            socket.leave(session.id)

            updateSession(session.id)
        }

        if (session && session.players.length === 0) {
            dispatch(removeSession(session))
        }
        upadteLoby()
    })

    socket.on(JOIN_DEPARTMENT, (department: DepartmentsNames) => {
        const playerState = getPlayerState(socket)
        if (playerState && playerState.department) {
            return socket.emit(SET_PLAYER, { error: 'Cant join department while in another.' })
        }
        dispatch(joinDepartment(socket, department))
        socket.emit(SET_PLAYER, { data: getPlayerState(socket) })
        console.log(socket.user.username, 'joining', department)
    })

    socket.on(JOIN_SESSION, id => {
        const session = getSessionById(id)

        if (session) {
            dispatch(joinSession(socket, session))
            socket.emit(SET_SESSION, { data: getUserSession(socket) })
            socket.join(session.id)
            updateSession(session.id)
            upadteLoby()
        } else {
            socket.emit(SET_SESSION, { error: 'Unable to join session.' })
        }
    })

    socket.on('disconnect', () => {
        onDisconnect(socket)
        const session = getUserSession(socket)
        if (session) {
            let i = 30
            const timer: NodeJS.Timeout = setInterval(() => {
                const player = session.players.find(player => player.username === socket.user.username)
                if (i === 0) {
                    dispatch(leaveSession(socket))
                    if (session.players.length === 0) {
                        dispatch(removeSession(session))
                    }
                    clearInterval(timer)
                    updateSession(session.id)
                    upadteLoby()
                }

                if (player && player.status === 1) {
                    return clearInterval(timer)
                }
                i--
            }, 1000)
        }
    })

    function updateSession(id: string) {
        io.to(id).emit(SET_SESSION, { data: getSessionById(id) })
    }

    function upadteLoby() {
        io.emit(SET_LOBY, getOnlineSessions())
    }
}

export function onDisconnect(socket: OnlineUserSocket): void {
    store.dispatch(userOffline(socket))
    logger.info(`${socket.user.username} disconnected.`, { socket: socket.id, user: socket.user.id })
}