import { Request, Response } from 'express'
import { getServerAccessKey } from '../../constants/certificates'
import { decodeHeader } from '../../constants/cors'
import UserModel from '../../db/models/UserModel'
import jwt from 'jsonwebtoken'

async function Login(req: Request, res: Response) {
    const decoded = decodeHeader(req.headers['authentication'] as string)

    if (!decoded) return res.status(403).json({ error: 'Access denied. Invalid header sent.' })

    const [username, password] = decoded.split(':')

    if (!username || !password) res.status(200).json({ error: 'All fields are required.' })

    const user = await UserModel.findOne({ $or: [{ phone: username }, { username }, { email: username }] }).select('password')

    if (!user) return res.status(200).json({ error: 'Unable to find user.' })

    if (!user.comparePassword(password)) return res.status(200).json({ error: 'Wrong password.' })

    const token = jwt.sign({ id: user.id }, getServerAccessKey())

    res.status(200).json({ user: user.toJSON(), token })
}

export default Login