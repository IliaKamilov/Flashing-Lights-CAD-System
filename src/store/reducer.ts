import { LobyActions, LobyState, USER_ONLINE, USER_OFFLINE, CREATE_SESSION, LEAVE_SESSION, REMOVE_SESSION, JOIN_SESSION, JOIN_DEPARTMENT } from "./types"

const initialState: LobyState = {
    users: [],
    sessions: []
}

export function lobyReducer(
    state = initialState,
    action: LobyActions,
): LobyState {
    let reduced: any
    switch (action.type) {
        case USER_ONLINE:
            state.sessions.forEach(
                session => {
                    session.players.forEach(
                        player => {
                            if (player.username === action.payload.username) player.status = 1
                        }
                    )
                }
            )
            state.users.push(action.payload)
            return state
        case USER_OFFLINE:
            state.sessions.forEach(
                session => {
                    session.players.forEach(
                        player => {
                            if (player.username === action.payload.username) player.status = 0
                        }
                    )
                }
            )
            state.users = state.users.filter(user => user.username !== action.payload.username)
            return state
        case CREATE_SESSION:
            return Object.assign({}, state, {
                sessions: [...state.sessions, action.payload]
            })
        case LEAVE_SESSION:
            state.sessions.forEach(
                session => {
                    session.players = session.players.filter(
                        player => player.username !== action.payload.user.username
                    )
                }
            )
            return state
        case REMOVE_SESSION: {
            return Object.assign({}, state, {
                sessions: state.sessions.filter(session => session.id !== action.payload.id)
            })
        }
        case JOIN_SESSION: {
            state.sessions.forEach(session => {
                if (session.id === action.payload.session.id) {
                    if (!session.players.find(player => player.username === action.payload.socket.user.username)) {
                        session.players.push(action.payload.socket.user)
                    }
                }
            })
            return state
        }
        case JOIN_DEPARTMENT: {
            state.sessions.forEach(session => {
                session.players.forEach(player => {
                    if (player.username === action.payload.player.username) {
                        player.department = action.payload.department
                    }
                })
            })
            return state
        }
        default:
            return state
    }
}