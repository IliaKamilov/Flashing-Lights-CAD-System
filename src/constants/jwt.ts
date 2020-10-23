import jwt from 'jsonwebtoken'
import { getServerAccessKey } from './certificates'

export function signToken(payload: any) {
    return jwt.sign(payload, getServerAccessKey())
}

export function decodeToken(token: string) {
    try {
        return jwt.verify(token, getServerAccessKey())
    } catch (error) {
        return error
    }
}

export default jwt