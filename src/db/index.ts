import mongoose from 'mongoose'
import { config } from 'dotenv'
 
config()

const URI = process.env.MONGO_URI || ''

export function connect() {
    if (!URI) throw Error('Mongo uri not provided.')

    mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    })
    .then(() => {
        console.log(`Mongo connected.`)
    })
    .catch(err => {
        throw err
    })
}