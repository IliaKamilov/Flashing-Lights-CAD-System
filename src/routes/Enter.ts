import { Request, Response } from 'express'
import { signToken } from '../constants/jwt'
import UserModel from '../db/models/UserModel'
import { isOnline } from '../store/actions'

async function EnterName(req: Request, res: Response) {
    const name = req.headers['x-enter-name'] as string

    if (!name) return res.status(400).json({ error: 'Name not provided.' })

    const registered = await UserModel.findOne({ username: name.toLowerCase() }).exec()

    if (Boolean(registered)) return res.status(403).json({ error: 'This name belongs to registered user.' })

    if (!/^[A-Za-z0-9]+$/.test(name) || name.length < 4) return res.status(400).json({ error: 'Name must be at least 4 characters long and contain only letters, numbers.' })

    const taken = isOnline(name)

    if (taken) return res.status(400).json({ error: 'This name is taken.' })

    const token = signToken({ username: name, isAnon: true })

    res.status(200).json({ token, name })
}

export default EnterName