import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export interface CreateUser {
    username: string
    password: string
    role?: 'admin' | 'user'
}

interface UserDocument extends mongoose.Document {
    username: string
    password: string
    role?: 'user' | 'admin',
    comparePassword: (p: string) => boolean
}

const UserSchema: mongoose.Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    created: {
        type: Date,
        select: false
    },
    updated: {
        type: Date,
        select: false
    }
}, {
    timestamps: { createdAt: 'created', updatedAt: 'updated' }
})

UserSchema.pre<UserDocument>('save', function (next: () => void) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10))
        next()
    }
})

UserSchema.methods.comparePassword = function (p: string): boolean {
    return bcrypt.compareSync(p, this.password)
}

const UserModel = mongoose.model<UserDocument>('user', UserSchema)

export default UserModel