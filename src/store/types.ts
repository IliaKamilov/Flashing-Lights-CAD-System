import { OnlineUserSocket } from "../socket/types"

export type DepartmentsNames = 'Police' | 'Fire' | 'EMS' | 'Dispatch'

export interface OnlineUserData {
    id: string | null
    username: string
    registered?: boolean
    status: 0 | 1
    department?: DepartmentsNames
}

export interface SessionData {
    id: string
    name: string
    players: OnlineUserData[]
    maxPlayers: number
}

export interface LobyState {
    users: OnlineUserData[]
    sessions: SessionData[]
}

export const USER_ONLINE = 'USER_ONLINE'

export interface UserOnlineAction {
    type: typeof USER_ONLINE,
    payload: OnlineUserData
}

export const USER_OFFLINE = 'USER_OFFLINE'

export interface UserOfflineAction {
    type: typeof USER_OFFLINE,
    payload: OnlineUserData
}

export const GET_SESSION = 'GET_SESSION'

export interface GetUserSessionAction {
    type: typeof GET_SESSION
    payload: SessionData
}

export const JOIN_SESSION = 'JOIN_SESSION'

export interface JoinSessionAction {
    type: typeof JOIN_SESSION
    payload: {
        socket: OnlineUserSocket,
        session: SessionData
    }
}

export const CREATE_SESSION = 'CREATE_SESSION'

export interface CreateSessionAction {
    type: typeof CREATE_SESSION
    payload: SessionData
}

export const LEAVE_SESSION = 'LEAVE_SESSION'

export interface LeaveSessionAction {
    type: typeof LEAVE_SESSION
    payload: OnlineUserSocket
}

export const REMOVE_SESSION = 'REMOVE_SESSION'

export interface RemoveSessionAction {
    type: typeof REMOVE_SESSION
    payload: SessionData
}

export const GET_LOBY = 'GET_LOBY'
export const SET_LOBY = 'SET_LOBY'
export const SET_SESSION = 'SET_SESSION'
export const CONNECTION_CHANGE = 'CONNECTION_CHANGE'
export const CONNECTED = 'CONNECTED'
export const DISCONNECTED = 'DISCONNECTED'
export const SET_PLAYER = 'SET_PLAYER'
export const JOIN_DEPARTMENT = 'JOIN_DEPARTMENT'

export interface JoinDepartmentAction {
    type: typeof JOIN_DEPARTMENT
    payload: {
        department: DepartmentsNames
        player: OnlineUserData
    }
}

export type LobyEvents =
    typeof GET_LOBY |
    typeof SET_LOBY |
    typeof CONNECTION_CHANGE |
    typeof CONNECTED |
    typeof DISCONNECTED |
    typeof SET_SESSION

export type AllTypes = LobyActions['type'] | LobyEvents | string

export type LobyActions =
    UserOnlineAction |
    UserOfflineAction |
    GetUserSessionAction |
    CreateSessionAction |
    LeaveSessionAction |
    JoinSessionAction |
    RemoveSessionAction |
    JoinDepartmentAction