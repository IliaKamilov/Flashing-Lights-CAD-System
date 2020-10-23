import Express from 'express'
import Https from 'https'
import { getHttpsOptions } from './constants/certificates'
import routes from './routes'
import * as MongoDB from './db'
import { useGlobalCorsOptions } from './constants/cors'
import createIoServer from './socket'

const app: Express.Application = Express()
const httpsServer: Https.Server = Https.createServer(getHttpsOptions(), app)

app.options('*', useGlobalCorsOptions)

app.use(useGlobalCorsOptions)

app.use(routes)

createIoServer(httpsServer)

const PORT: string | number = process.env.PORT || 7000

httpsServer.listen(PORT, (): void => {
    console.log(`listening *:${PORT}`)

    try {
        MongoDB.connect()
    } catch (error) {
        console.log(error)
    }
})