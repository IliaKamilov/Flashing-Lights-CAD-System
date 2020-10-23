import { LobyActions, OnlineUserData } from "../store/types";

export interface OnlineUserSocket extends SocketIO.Socket {
    user: OnlineUserData
}