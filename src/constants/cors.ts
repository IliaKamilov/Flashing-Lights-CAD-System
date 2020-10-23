import cors, { CorsOptions } from 'cors'
import { Request, Response } from 'express'
import { getServerAccessKey } from './certificates'

export function decodeHeader(encoded: string) {
    return encoded ? Buffer.from(encoded, 'base64').toString() : null
}

export function parseJSON(j: string) {
    try {
        return JSON.parse(j)
    } catch (error) {
        return false
    }
}

const globalCorsOptions: CorsOptions = {
    origin: ['https://localhost:3000', 'https://10.0.0.5:3000', 'https://127.0.0.1:3000'],
    allowedHeaders: ['X-Access-Token', 'Authentication', 'X-Enter-Name'],
    preflightContinue: false
}

export const useGlobalCorsOptions = cors(globalCorsOptions)

export const useAccountCorsOption = cors({ ...globalCorsOptions, methods: 'POST' })

export function validateAccessTokenHeaders(req: Request, res: Response, next: (e?: Error) => void): void {
    const accessToken: string | string[] | null = req.headers['x-access-token'] || req.query.access_token?.toString() || null
    console.log(accessToken)
    // codes 0 = not provided; 1 = bad key; 2 = expired key;
    res.status(200).send('ok')
    return next()

    if (!accessToken) {
        res.status(400).send({
            error: {
                message: 'An access token is required to request this resource.',
                code: 0,
                type: 'AuthException'
            }
        })
        return
    }
    const decoded = Buffer.from(accessToken as string, 'base64').toString()

    if (decoded !== getServerAccessKey()) {
        res.status(400).send({
            error: {
                message: 'Invalid access token.',
                code: 0,
                type: 'AuthException'
            }
        })
        return
    }

    next()

    // Error validating access token: The session is invalid because the user logged out.
}