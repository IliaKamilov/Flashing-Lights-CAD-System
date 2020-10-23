import fs from 'fs'
import { ServerOptions } from 'https'
import { config } from 'dotenv'

config()

function sslCeriticate(): string {
    return fs.readFileSync('ssl/self.cert', { encoding: 'utf8' })
}

function sslKey(): string {
    return fs.readFileSync('ssl/self.key', { encoding: 'utf8' })
}

export function getServerAccessKey(): string {
    return process.env.SERVER_KEY || 'NOT_SECURED_SERVER_ACCESS_KEY'
}

export function getHttpsOptions(): ServerOptions {
    return {
        key: sslKey(),
        cert: sslCeriticate()
    }
}